const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User ${socket.userId} connected via socket`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Join mechanic/garage to their service room
    if (socket.userRole === 'mechanic' || socket.userRole === 'garage') {
      socket.join(`service_${socket.userId}`);
    }

    // Handle booking updates
    socket.on('join_booking', (bookingId) => {
      socket.join(`booking_${bookingId}`);
      logger.info(`User ${socket.userId} joined booking room ${bookingId}`);
    });

    // Handle emergency requests
    socket.on('emergency_request', (data) => {
      logger.info(`Emergency request from user ${socket.userId}:`, data);
      // Broadcast to nearby mechanics/garages
      socket.broadcast.emit('emergency_alert', {
        ...data,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Handle location updates
    socket.on('location_update', (data) => {
      socket.broadcast.emit('user_location_update', {
        userId: socket.userId,
        location: data,
        timestamp: new Date()
      });
    });

    // Handle service status updates
    socket.on('service_status_update', (data) => {
      const { bookingId, status, message } = data;
      io.to(`booking_${bookingId}`).emit('booking_status_update', {
        bookingId,
        status,
        message,
        timestamp: new Date()
      });
    });

    // Handle chat messages
    socket.on('chat_message', (data) => {
      const { bookingId, message, senderType } = data;
      io.to(`booking_${bookingId}`).emit('new_message', {
        bookingId,
        message,
        senderId: socket.userId,
        senderType,
        timestamp: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`User ${socket.userId} disconnected: ${reason}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };
