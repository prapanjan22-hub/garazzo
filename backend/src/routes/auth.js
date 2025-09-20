const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { loginRateLimit, registerRateLimit, passwordResetRateLimit } = require('../middleware/auth');
const { sendEmail, sendSMS } = require('../utils/notifications');
const logger = require('../utils/logger');

const router = express.Router();

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  registerRateLimit,
  [
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['customer', 'mechanic', 'garage']).withMessage('Invalid role')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, phone, password, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Garazzo - Verify Your Email',
        template: 'emailVerification',
        data: {
          name: user.firstName,
          verificationToken: user.emailVerificationToken
        }
      });
    } catch (error) {
      logger.error('Failed to send verification email:', error);
    }

    // Send verification SMS
    try {
      await sendSMS({
        to: user.phone,
        message: `Welcome to Garazzo! Your verification code is: ${user.phoneVerificationToken}`
      });
    } catch (error) {
      logger.error('Failed to send verification SMS:', error);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email and phone.',
      data: {
        user: user.getPublicProfile(),
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  loginRateLimit,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please verify your email and phone.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastActive = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  })
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { refreshToken } = req.body;

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  })
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // Add token to blacklist
    const { getRedisClient } = require('../config/database');
    const redisClient = getRedisClient();
    const decoded = jwt.decode(token);
    
    if (decoded && decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redisClient.setEx(`blacklist:${token}`, ttl, 'true');
      }
    }
  }

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email',
  [
    body('token').notEmpty().withMessage('Verification token is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.body;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.status = user.isPhoneVerified ? 'active' : 'pending_verification';
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  })
);

// @route   POST /api/auth/verify-phone
// @desc    Verify phone number
// @access  Public
router.post('/verify-phone',
  [
    body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
    body('code').isLength({ min: 4, max: 6 }).withMessage('Verification code must be 4-6 digits')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { phone, code } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.phoneVerificationToken !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    user.isPhoneVerified = true;
    user.phoneVerificationToken = undefined;
    user.status = user.isEmailVerified ? 'active' : 'pending_verification';
    await user.save();

    res.json({
      success: true,
      message: 'Phone verified successfully'
    });
  })
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password',
  passwordResetRateLimit,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send reset email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset - Garazzo',
        template: 'passwordReset',
        data: {
          name: user.firstName,
          resetToken
        }
      });

      res.json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset email'
      });
    }
  })
);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  })
);

module.exports = router;
