const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const admin = require('firebase-admin');
const logger = require('./logger');

// Service status tracking
const serviceStatus = {
  sendgrid: false,
  twilio: false,
  firebase: false
};

// Default implementations for development mode
const defaultNotificationHandlers = {
  sendEmail: async (to, subject, text) => {
    logger.info('Development mode - Email not sent:', { to, subject, text });
    return { success: true, development: true };
  },
  sendSMS: async (to, message) => {
    logger.info('Development mode - SMS not sent:', { to, message });
    return { success: true, development: true };
  },
  sendPushNotification: async (token, notification) => {
    logger.info('Development mode - Push notification not sent:', { token, notification });
    return { success: true, development: true };
  }
};

// Use default implementations initially
let services = { ...defaultNotificationHandlers };

// Initialize SendGrid
const initializeSendGrid = () => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not found in environment variables');
    }
    
    if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      throw new Error('Invalid SendGrid API key format');
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    logger.info('✅ SendGrid initialized successfully');
    serviceStatus.sendgrid = true;
  } catch (error) {
    logger.warn(`SendGrid initialization failed: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      logger.info('Running in development mode - emails will be logged but not sent');
    }
  }
};

// Initialize Twilio
let twilioClient = null;
const initializeTwilio = () => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Missing Twilio credentials in environment variables');
    }

    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Verify credentials by making a test API call
    twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch()
      .then(() => {
        logger.info('✅ Twilio initialized successfully');
        serviceStatus.twilio = true;
      })
      .catch((error) => {
        logger.warn(`Twilio credentials verification failed: ${error.message}`);
        twilioClient = null;
      });
  } catch (error) {
    logger.warn(`Twilio initialization failed: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      logger.info('Running in development mode - SMS will be logged but not sent');
    }
  }
};

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('Missing Firebase credentials in environment variables');
    }

    if (admin.apps.length) {
      logger.info('Firebase Admin SDK already initialized');
      serviceStatus.firebase = true;
      return;
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });

    logger.info('✅ Firebase Admin SDK initialized successfully');
    serviceStatus.firebase = true;
  } catch (error) {
    logger.warn(`Firebase initialization failed: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      logger.info('Running in development mode - push notifications will be logged but not sent');
    }
  }
};

// Initialize all services
initializeSendGrid();
initializeTwilio();
initializeFirebase();

// Template variable validation
const templateVariables = {
  emailVerification: ['name', 'verificationLink'],
  passwordReset: ['name', 'resetLink'],
  bookingConfirmation: ['customerName', 'serviceProviderName', 'serviceType', 'bookingDate', 'bookingTime', 'location', 'price']
};

// Base template with common styles
const baseTemplate = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333333;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin-bottom: 20px;">
      <img src="${process.env.LOGO_URL || 'https://garazzo.com/logo.png'}" alt="Garazzo" style="max-width: 150px; margin-bottom: 10px;" />
    </div>
    {{content}}
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
      <p>This is an automated message, please do not reply to this email.</p>
      <p>If you have any questions, please contact our support team at ${process.env.SUPPORT_EMAIL || 'support@garazzo.com'}</p>
      <p>&copy; ${new Date().getFullYear()} Garazzo. All rights reserved.</p>
    </div>
  </div>
`;

// Email templates with required variables validation
const emailTemplates = {
  emailVerification: {
    subject: 'Welcome to Garazzo - Verify Your Email',
    template: `
      <h2 style="color: #007bff;">Welcome to Garazzo!</h2>
      <p>Hi {{name}},</p>
      <p>Thank you for registering with Garazzo. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{verificationLink}}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">{{verificationLink}}</p>
      <p><strong>Note:</strong> This link will expire in 24 hours.</p>
      <p>Best regards,<br>The Garazzo Team</p>
    `
  },
  passwordReset: {
    subject: 'Password Reset - Garazzo',
    template: `
      <h2 style="color: #dc3545;">Password Reset Request</h2>
      <p>Hi {{name}},</p>
      <p>You requested a password reset for your Garazzo account. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{resetLink}}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">{{resetLink}}</p>
      <p><strong>Warning:</strong> This link will expire in 10 minutes.</p>
      <p>If you didn't request this reset, please ignore this email or contact our support team immediately.</p>
      <p>Best regards,<br>The Garazzo Team</p>
    `
  },
  bookingConfirmation: {
    subject: 'Booking Confirmed - Garazzo',
    template: `
      <h2 style="color: #28a745;">Booking Confirmed!</h2>
      <p>Hi {{customerName}},</p>
      <p>Your booking has been confirmed with {{serviceProviderName}}.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Service:</strong></td>
            <td style="padding: 8px 0;">{{serviceType}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Date:</strong></td>
            <td style="padding: 8px 0;">{{bookingDate}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Time:</strong></td>
            <td style="padding: 8px 0;">{{bookingTime}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Location:</strong></td>
            <td style="padding: 8px 0;">{{location}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Price:</strong></td>
            <td style="padding: 8px 0;">{{price}}</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/bookings" 
           style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          View Booking Details
        </a>
      </div>
      <p>You can track your booking status in the app or by clicking the button above.</p>
      <p>Best regards,<br>The Garazzo Team</p>
    `
  }
};

const templateCache = require('./templateCache');
const rateLimiters = require('./rateLimiter');

// Rate limiting check helper
const checkRateLimit = async (type, key, count = 1) => {
  try {
    const limiter = rateLimiters[type];
    if (!limiter) {
      throw new Error(`Unknown rate limiter type: ${type}`);
    }
    return await limiter.checkLimit(key, count);
  } catch (error) {
    logger.warn(`Rate limit check failed for ${type}:`, error);
    throw error;
  }
};

// Template rendering helpers with caching
const renderTemplate = (template, data) => {
  const cacheKey = getCacheKey(template, data);
  
  // Try to get from cache first
  const cachedResult = templateCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // First pass: detect any missing required variables
  const missingVars = [];
  template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (typeof data[key] === 'undefined') {
      missingVars.push(key);
    }
    return match;
  });

  if (missingVars.length > 0) {
    throw new Error(`Missing required template variables: ${missingVars.join(', ')}`);
  }

  // Second pass: replace variables with their values
  const renderedContent = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    // Basic XSS prevention for HTML templates
    if (typeof value === 'string') {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }
    return value;
  });

  // Insert rendered content into base template
  const finalResult = baseTemplate.replace('{{content}}', renderedContent);
  
  // Cache the result
  templateCache.set(cacheKey, finalResult);
  
  return finalResult;
};

// Helper function to generate cache key
const getCacheKey = (template, data) => {
  const dataHash = Object.entries(data)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return `template:${template.slice(0, 32)}|data:${dataHash}`;
};

const validateEmailData = (templateName, data) => {
  if (!templateVariables[templateName]) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  const requiredVars = templateVariables[templateName];
  const missingVars = requiredVars.filter(variable => !data.hasOwnProperty(variable));

  if (missingVars.length > 0) {
    throw new Error(`Missing required variables for template "${templateName}": ${missingVars.join(', ')}`);
  }

  // Validate email addresses
  if (data.email && !isValidEmail(data.email)) {
    throw new Error(`Invalid email address: ${data.email}`);
  }

  return true;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Enhanced email sending implementation with rate limiting
const sendEmail = async ({ to, subject, template, data = {}, html, text }) => {
  // Development mode check
  if (!serviceStatus.sendgrid) {
    logger.info('Development mode - Email not sent:', { to, subject, template, data });
    return { success: true, development: true };
  }

  // Check rate limit
  const rateLimit = await checkRateLimit('email', process.env.FROM_EMAIL || 'default');

  try {
    // Input validation
    if (!to || !isValidEmail(to)) {
      throw new Error(`Invalid recipient email address: ${to}`);
    }

    // Build email content
    let emailContent;
    
    if (template && emailTemplates[template]) {
      // Validate template data
      validateEmailData(template, data);

      const templateData = emailTemplates[template];
      const renderedHtml = renderTemplate(templateData.template, data);
      
      emailContent = {
        to,
        from: process.env.FROM_EMAIL || 'noreply@garazzo.com',
        subject: templateData.subject,
        html: renderedHtml
      };
    } else {
      if (!subject) {
        throw new Error('Email subject is required when not using a template');
      }

      if (!html && !text) {
        throw new Error('Either HTML or text content is required when not using a template');
      }

      emailContent = {
        to,
        from: process.env.FROM_EMAIL || 'noreply@garazzo.com',
        subject,
        html: html || text,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
      };
    }

    // Track email attempt
    logger.info('Sending email:', { to, subject, template });

    // Send email
    const result = await sgMail.send(emailContent);
    logger.info('Email sent successfully:', { to, messageId: result[0]?.headers['x-message-id'] });

    return { 
      success: true,
      messageId: result[0]?.headers['x-message-id']
    };

  } catch (error) {
    logger.error('Email sending failed:', error);
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Email content would have been:', emailContent);
    }
    throw error;
  }
};

// Phone number validation helper
const validatePhoneNumber = (phoneNumber) => {
  // Basic international phone number validation
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

// Enhanced SMS implementation with validation, error handling, and rate limiting
const sendSMS = async ({ to, message, template, data = {} }) => {
  if (!serviceStatus.twilio) {
    logger.info('Development mode - SMS not sent:', { to, message, template, data });
    return { success: true, development: true };
  }

  // Check rate limit
  const rateLimit = await checkRateLimit('sms', process.env.TWILIO_PHONE_NUMBER || 'default');

  try {
    // Input validation
    if (!to || !validatePhoneNumber(to)) {
      throw new Error(`Invalid phone number format: ${to}. Must be in E.164 format (e.g., +1234567890)`);
    }

    if (!message && !template) {
      throw new Error('Either message or template is required');
    }

    // Process template if provided
    let finalMessage = message;
    if (template) {
      // Simple template processing for SMS
      finalMessage = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (typeof data[key] === 'undefined') {
          throw new Error(`Missing template variable: ${key}`);
        }
        return data[key];
      });
    }

    if (!finalMessage || finalMessage.trim().length === 0) {
      throw new Error('SMS message cannot be empty');
    }

    // Track SMS attempt
    logger.info('Sending SMS:', { to, template });

    // Send SMS
    const result = await twilioClient.messages.create({
      body: finalMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    logger.info('SMS sent successfully:', { 
      to, 
      messageId: result.sid,
      status: result.status
    });

    return { 
      success: true, 
      messageId: result.sid,
      status: result.status
    };

  } catch (error) {
    logger.error('SMS sending failed:', {
      error: error.message,
      code: error.code,
      to,
      template
    });

    // Specific error handling for common Twilio errors
    if (error.code === 21211) {
      throw new Error('Invalid phone number format');
    } else if (error.code === 21608) {
      throw new Error('Phone number is not a valid mobile number');
    } else if (error.code === 21610) {
      throw new Error('Phone number is blacklisted');
    } else if (error.code === 21614) {
      throw new Error('Invalid sending phone number');
    }

    throw error;
  }
};

// Enhanced push notification implementation with validation, platform-specific features, and rate limiting
const sendPushNotification = async ({ token, title, body, data = {}, options = {} }) => {
  if (!serviceStatus.firebase) {
    logger.info('Development mode - Push notification not sent:', { token, title, body, data });
    return { success: true, development: true };
  }

  // Check rate limit
  const rateLimit = await checkRateLimit('push', process.env.FIREBASE_PROJECT_ID || 'default');

  try {
    // Input validation
    if (!token || typeof token !== 'string' || token.length < 32) {
      throw new Error('Invalid FCM token');
    }

    if (!title || !body) {
      throw new Error('Notification title and body are required');
    }

    // Validate data payload
    if (typeof data !== 'object') {
      throw new Error('Data payload must be an object');
    }

    // Convert data values to strings (FCM requirement)
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {});

    // Build platform-specific notification message
    const message = {
      token,
      notification: {
        title,
        body,
        ...options.notification
      },
      data: processedData,
      android: {
        priority: 'high',
        notification: {
          sound: options.sound || 'default',
          clickAction: options.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
          channelId: options.channelId || 'high_importance_channel',
          icon: options.icon,
          color: options.color,
          ...options.android
        }
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body,
              subtitle: options.subtitle
            },
            sound: options.sound || 'default',
            badge: options.badge,
            category: options.category || 'NEW_MESSAGE_CATEGORY',
            'content-available': 1,
            'mutable-content': 1,
            ...options.aps
          }
        },
        headers: {
          'apns-priority': '10',
          'apns-topic': process.env.APNS_TOPIC,
          ...options.apnsHeaders
        }
      },
      webpush: {
        headers: {
          Urgency: 'high',
          TTL: '86400'
        },
        notification: {
          title,
          body,
          icon: options.icon || process.env.NOTIFICATION_ICON_URL,
          badge: options.badge || process.env.NOTIFICATION_BADGE_URL,
          vibrate: options.vibrate || [100, 50, 100],
          requireInteraction: options.requireInteraction || false,
          ...options.webpush
        }
      }
    };

    // Track notification attempt
    logger.info('Sending push notification:', { 
      token: token.substring(0, 8) + '...', // Log partial token for security
      title,
      platform: options.platform || 'all'
    });

    const response = await admin.messaging().send(message);
    
    logger.info('Push notification sent successfully:', { 
      token: token.substring(0, 8) + '...', 
      messageId: response 
    });

    return { 
      success: true, 
      messageId: response,
      platform: options.platform || 'all'
    };

  } catch (error) {
    logger.error('Push notification sending failed:', {
      error: error.message,
      errorCode: error.code,
      token: token.substring(0, 8) + '...'
    });

    // Handle specific Firebase error codes
    if (error.code === 'messaging/invalid-registration-token') {
      throw new Error('Invalid FCM token');
    } else if (error.code === 'messaging/registration-token-not-registered') {
      throw new Error('FCM token is no longer valid');
    } else if (error.code === 'messaging/message-rate-exceeded') {
      throw new Error('Message rate limit exceeded');
    } else if (error.code === 'messaging/invalid-argument') {
      throw new Error('Invalid message format');
    } else if (error.code === 'messaging/server-unavailable') {
      throw new Error('FCM server is temporarily unavailable');
    }

    throw error;
  }
};

// Bulk push notification implementation with batching, error handling, and rate limiting
const sendBulkPushNotifications = async (notifications, options = {}) => {
  if (!serviceStatus.firebase) {
    logger.info('Development mode - Bulk push notifications not sent:', { count: notifications.length });
    return { 
      success: true, 
      development: true, 
      successCount: notifications.length, 
      failureCount: 0 
    };
  }

  // Check rate limit for bulk operations
  const rateLimit = await checkRateLimit('bulkPush', process.env.FIREBASE_PROJECT_ID || 'default', Math.ceil(notifications.length / 500));

  try {
    // Input validation
    if (!Array.isArray(notifications) || notifications.length === 0) {
      throw new Error('Notifications array is required and cannot be empty');
    }

    const BATCH_SIZE = 500; // Firebase limitation
    const results = {
      success: true,
      totalCount: notifications.length,
      successCount: 0,
      failureCount: 0,
      responses: [],
      failedNotifications: []
    };

    // Process notifications in batches
    for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
      const batch = notifications.slice(i, i + BATCH_SIZE);
      
      // Validate and process batch messages
      const messages = batch.map(({ token, title, body, data = {}, ...notificationOptions }) => {
        if (!token || typeof token !== 'string' || token.length < 32) {
          throw new Error(`Invalid FCM token in batch: ${token}`);
        }

        if (!title || !body) {
          throw new Error('Notification title and body are required');
        }

        // Convert data values to strings
        const processedData = Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {});

        return {
          token,
          notification: {
            title,
            body,
            ...notificationOptions.notification
          },
          data: processedData,
          android: {
            priority: 'high',
            notification: {
              sound: options.sound || 'default',
              clickAction: options.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
              channelId: options.channelId || 'high_importance_channel',
              icon: options.icon,
              color: options.color,
              ...options.android,
              ...notificationOptions.android
            }
          },
          apns: {
            payload: {
              aps: {
                alert: {
                  title,
                  body,
                  subtitle: options.subtitle
                },
                sound: options.sound || 'default',
                badge: options.badge,
                category: options.category || 'NEW_MESSAGE_CATEGORY',
                'content-available': 1,
                'mutable-content': 1,
                ...options.aps,
                ...notificationOptions.aps
              }
            },
            headers: {
              'apns-priority': '10',
              'apns-topic': process.env.APNS_TOPIC,
              ...options.apnsHeaders,
              ...notificationOptions.apnsHeaders
            }
          },
          webpush: {
            headers: {
              Urgency: 'high',
              TTL: '86400'
            },
            notification: {
              title,
              body,
              icon: options.icon || process.env.NOTIFICATION_ICON_URL,
              badge: options.badge || process.env.NOTIFICATION_BADGE_URL,
              vibrate: options.vibrate || [100, 50, 100],
              requireInteraction: options.requireInteraction || false,
              ...options.webpush,
              ...notificationOptions.webpush
            }
          }
        };
      });

      // Send batch and track progress
      logger.info(`Sending batch of ${messages.length} notifications (${i + 1} to ${Math.min(i + BATCH_SIZE, notifications.length)} of ${notifications.length})`);

      try {
        const batchResponse = await admin.messaging().sendAll(messages);
        
        results.successCount += batchResponse.successCount;
        results.failureCount += batchResponse.failureCount;
        results.responses.push(...batchResponse.responses);

        // Process failed notifications in this batch
        const failedInBatch = batchResponse.responses
          .map((resp, idx) => {
            if (resp.error) {
              return {
                token: batch[idx].token,
                error: resp.error.message,
                errorCode: resp.error.code,
                originalMessage: batch[idx]
              };
            }
            return null;
          })
          .filter(Boolean);

        results.failedNotifications.push(...failedInBatch);

        // Log batch results
        logger.info(`Batch completed: ${batchResponse.successCount} succeeded, ${batchResponse.failureCount} failed`);
        
        if (failedInBatch.length > 0) {
          logger.warn('Failed notifications in batch:', failedInBatch);
        }

      } catch (batchError) {
        logger.error('Batch processing failed:', {
          error: batchError.message,
          batchSize: messages.length,
          startIndex: i
        });
        
        // Mark all messages in failed batch as failed
        results.failureCount += messages.length;
        results.failedNotifications.push(...messages.map(msg => ({
          token: msg.token,
          error: batchError.message,
          errorCode: batchError.code,
          originalMessage: msg
        })));
      }

      // Optional delay between batches to prevent rate limiting
      if (i + BATCH_SIZE < notifications.length && options.batchDelay) {
        await new Promise(resolve => setTimeout(resolve, options.batchDelay));
      }
    }

    // Final logging and cleanup
    if (results.failureCount > 0) {
      logger.warn('Bulk notification operation completed with failures:', {
        total: results.totalCount,
        successful: results.successCount,
        failed: results.failureCount,
        errorSummary: summarizeErrors(results.failedNotifications)
      });
    } else {
      logger.info('Bulk notification operation completed successfully:', {
        total: results.totalCount,
        successful: results.successCount
      });
    }

    return results;

  } catch (error) {
    logger.error('Bulk push notification operation failed:', {
      error: error.message,
      errorCode: error.code,
      notificationCount: notifications.length
    });
    throw error;
  }
};

// Helper function to summarize errors
const summarizeErrors = (failedNotifications) => {
  const errorCounts = failedNotifications.reduce((acc, {errorCode}) => {
    acc[errorCode] = (acc[errorCode] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(errorCounts)
    .map(([code, count]) => `${code}: ${count} occurrences`)
    .join(', ');
};

// Update module exports with enhanced implementations
if (process.env.SENDGRID_API_KEY || twilioClient || admin.apps.length) {
  Object.assign(module.exports, {
    sendEmail,
    sendSMS,
    sendPushNotification,
    sendBulkPushNotifications
  });
}
