const { getRedisClient } = require('../config/database');
const { publishMessage } = require('../config/mqtt');
const logger = require('../utils/logger');

class SocketService {
  constructor(io) {
    this.io = io;
    this.redisClient = getRedisClient();
  }

  // Join user to their personal room
  joinUserRoom(socket, userId) {
    socket.join(`user_${userId}`);
    logger.info(`User ${userId} joined personal room`);
  }

  // Join service provider to their service room
  joinServiceRoom(socket, userId, userRole) {
    if (['mechanic', 'garage'].includes(userRole)) {
      socket.join(`service_${userId}`);
      logger.info(`Service provider ${userId} joined service room`);
    }
  }

  // Join booking room
  joinBookingRoom(socket, bookingId) {
    socket.join(`booking_${bookingId}`);
    logger.info(`Socket joined booking room ${bookingId}`);
  }

  // Handle emergency requests
  async handleEmergencyRequest(socket, data) {
    const { location, vehicleId, emergencyType, description } = data;
    const userId = socket.userId;

    logger.warn(`Emergency request from user ${userId}:`, data);

    // Store emergency request in Redis
    await this.redisClient.setEx(
      `emergency:${userId}`,
      3600, // 1 hour TTL
      JSON.stringify({
        ...data,
        userId,
        timestamp: new Date(),
        status: 'active'
      })
    );

    // Broadcast to nearby service providers
    this.io.emit('emergency_alert', {
      ...data,
      userId,
      timestamp: new Date(),
      emergencyId: `emerg_${Date.now()}`
    });

    // Publish to MQTT for IoT devices
    publishMessage(`emergency/${vehicleId}`, {
      type: 'emergency_request',
      data: {
        userId,
        location,
        emergencyType,
        description,
        timestamp: new Date()
      }
    });

    return { success: true, emergencyId: `emerg_${Date.now()}` };
  }

  // Handle location updates
  handleLocationUpdate(socket, data) {
    const userId = socket.userId;
    
    // Store location in Redis
    this.redisClient.setEx(
      `location:${userId}`,
      300, // 5 minutes TTL
      JSON.stringify({
        ...data,
        userId,
        timestamp: new Date()
      })
    );

    // Broadcast to relevant users
    socket.broadcast.emit('user_location_update', {
      userId,
      location: data,
      timestamp: new Date()
    });
  }

  // Handle service status updates
  handleServiceStatusUpdate(socket, data) {
    const { bookingId, status, message, progress } = data;
    
    this.io.to(`booking_${bookingId}`).emit('booking_status_update', {
      bookingId,
      status,
      message,
      progress,
      timestamp: new Date()
    });

    // Update booking in database
    this.updateBookingStatus(bookingId, status, message, progress);
  }

  // Handle chat messages
  handleChatMessage(socket, data) {
    const { bookingId, message, senderType } = data;
    const senderId = socket.userId;

    this.io.to(`booking_${bookingId}`).emit('new_message', {
      bookingId,
      message,
      senderId,
      senderType,
      timestamp: new Date()
    });

    // Store message in database
    this.storeMessage(bookingId, senderId, message, senderType);
  }

  // Handle vehicle data updates
  handleVehicleDataUpdate(socket, data) {
    const { vehicleId, data: vehicleData } = data;
    const userId = socket.userId;

    // Store in Redis for real-time access
    this.redisClient.setEx(
      `vehicle_data:${vehicleId}`,
      60, // 1 minute TTL
      JSON.stringify({
        ...vehicleData,
        vehicleId,
        userId,
        timestamp: new Date()
      })
    );

    // Broadcast to vehicle owner
    this.io.to(`user_${userId}`).emit('vehicle_data_update', {
      vehicleId,
      data: vehicleData,
      timestamp: new Date()
    });
  }

  // Handle booking requests
  handleBookingRequest(socket, data) {
    const { mechanicId, bookingData } = data;
    
    // Notify specific mechanic
    this.io.to(`service_${mechanicId}`).emit('new_booking_request', {
      ...bookingData,
      timestamp: new Date()
    });
  }

  // Handle booking acceptance
  handleBookingAcceptance(socket, data) {
    const { bookingId, customerId, mechanicId } = data;
    
    // Notify customer
    this.io.to(`user_${customerId}`).emit('booking_accepted', {
      bookingId,
      mechanicId,
      timestamp: new Date()
    });

    // Join both parties to booking room
    this.io.to(`user_${customerId}`).socketsJoin(`booking_${bookingId}`);
    this.io.to(`service_${mechanicId}`).socketsJoin(`booking_${bookingId}`);
  }

  // Handle payment updates
  handlePaymentUpdate(socket, data) {
    const { bookingId, paymentStatus, amount } = data;
    
    this.io.to(`booking_${bookingId}`).emit('payment_update', {
      bookingId,
      paymentStatus,
      amount,
      timestamp: new Date()
    });
  }

  // Handle disconnect
  handleDisconnect(socket) {
    const userId = socket.userId;
    logger.info(`User ${userId} disconnected`);
    
    // Remove from active users
    this.redisClient.del(`location:${userId}`);
  }

  // Helper methods
  async updateBookingStatus(bookingId, status, message, progress) {
    // This would typically update the database
    // Implementation depends on your database setup
    logger.info(`Updating booking ${bookingId} status to ${status}`);
  }

  async storeMessage(bookingId, senderId, message, senderType) {
    // This would typically store the message in the database
    logger.info(`Storing message for booking ${bookingId}`);
  }

  // Get online users
  async getOnlineUsers() {
    const sockets = await this.io.fetchSockets();
    return sockets.map(socket => ({
      userId: socket.userId,
      userRole: socket.userRole,
      connectedAt: socket.connectedAt
    }));
  }

  // Send notification to user
  sendNotificationToUser(userId, notification) {
    this.io.to(`user_${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date()
    });
  }

  // Send notification to service providers
  sendNotificationToServiceProviders(notification) {
    this.io.emit('service_provider_notification', {
      ...notification,
      timestamp: new Date()
    });
  }
}

module.exports = SocketService;
