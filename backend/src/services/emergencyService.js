const { getPostgresPool, getRedisClient } = require('../config/database');
const { publishMessage } = require('../config/mqtt');
const { sendSMS, sendPushNotification } = require('../utils/notifications');
const logger = require('../utils/logger');

class EmergencyService {
  constructor() {
    this.pgPool = getPostgresPool();
    this.redisClient = getRedisClient();
  }

  // Handle emergency alert from IoT device or app
  async handleEmergencyAlert(deviceId, emergencyData) {
    try {
      const {
        location,
        emergencyType = 'general',
        severity = 'high',
        description,
        vehicleData
      } = emergencyData;

      // Create emergency record
      const emergencyId = await this.createEmergencyRecord({
        deviceId,
        location,
        emergencyType,
        severity,
        description,
        vehicleData
      });

      // Find nearby service providers
      const nearbyProviders = await this.findNearbyServiceProviders(location, 10); // 10km radius

      // Send notifications
      await this.sendEmergencyNotifications(emergencyId, nearbyProviders, emergencyData);

      // Publish to MQTT for real-time updates
      publishMessage(`emergency/${deviceId}`, {
        type: 'emergency_alert',
        emergencyId,
        data: emergencyData,
        timestamp: new Date()
      });

      // Store in Redis for real-time tracking
      await this.redisClient.setEx(
        `emergency:${emergencyId}`,
        3600, // 1 hour TTL
        JSON.stringify({
          emergencyId,
          deviceId,
          location,
          emergencyType,
          severity,
          status: 'active',
          timestamp: new Date()
        })
      );

      logger.info(`Emergency alert processed: ${emergencyId}`);
      return { emergencyId, status: 'active' };

    } catch (error) {
      logger.error('Error handling emergency alert:', error);
      throw error;
    }
  }

  // Create emergency record in database
  async createEmergencyRecord(emergencyData) {
    const client = await this.pgPool.connect();
    try {
      const {
        deviceId,
        location,
        emergencyType,
        severity,
        description,
        vehicleData
      } = emergencyData;

      const query = `
        INSERT INTO emergencies (
          device_id, location, emergency_type, severity, 
          description, vehicle_data, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `;

      const values = [
        deviceId,
        JSON.stringify(location),
        emergencyType,
        severity,
        description,
        JSON.stringify(vehicleData),
        'active',
        new Date()
      ];

      const result = await client.query(query, values);
      return result.rows[0].id;

    } finally {
      client.release();
    }
  }

  // Find nearby service providers
  async findNearbyServiceProviders(location, radiusKm) {
    const client = await this.pgPool.connect();
    try {
      const { latitude, longitude } = location;

      const query = `
        SELECT 
          u.id, u.first_name, u.last_name, u.phone, u.email,
          u.address->>'coordinates' as coordinates,
          ST_Distance(
            ST_GeogFromText('POINT(' || (u.address->'coordinates'->>0) || ' ' || (u.address->'coordinates'->>1) || ')'),
            ST_GeogFromText('POINT($1 $2)')
          ) / 1000 as distance_km
        FROM users u
        WHERE u.role IN ('mechanic', 'garage')
          AND u.status = 'active'
          AND u.address->>'coordinates' IS NOT NULL
          AND ST_DWithin(
            ST_GeogFromText('POINT(' || (u.address->'coordinates'->>0) || ' ' || (u.address->'coordinates'->>1) || ')'),
            ST_GeogFromText('POINT($1 $2)'),
            $3 * 1000
          )
        ORDER BY distance_km ASC
        LIMIT 20
      `;

      const result = await client.query(query, [longitude, latitude, radiusKm]);
      return result.rows;

    } finally {
      client.release();
    }
  }

  // Send emergency notifications
  async sendEmergencyNotifications(emergencyId, serviceProviders, emergencyData) {
    const notifications = [];

    // Send SMS to nearby service providers
    for (const provider of serviceProviders.slice(0, 5)) { // Limit to 5 providers
      try {
        await sendSMS({
          to: provider.phone,
          message: `🚨 EMERGENCY ALERT 🚨\n\nLocation: ${emergencyData.location.address || 'Nearby'}\nType: ${emergencyData.emergencyType}\nSeverity: ${emergencyData.severity}\n\nPlease respond if you can help.\n\nGarazzo Emergency System`
        });
      } catch (error) {
        logger.error(`Failed to send SMS to provider ${provider.id}:`, error);
      }
    }

    // Send push notifications
    for (const provider of serviceProviders) {
      notifications.push({
        token: provider.fcm_token, // Assuming FCM token is stored
        title: 'Emergency Alert',
        body: `Emergency near ${emergencyData.location.address || 'your location'}`,
        data: {
          emergencyId,
          type: 'emergency_alert',
          location: JSON.stringify(emergencyData.location)
        }
      });
    }

    if (notifications.length > 0) {
      try {
        await this.sendBulkPushNotifications(notifications);
      } catch (error) {
        logger.error('Failed to send push notifications:', error);
      }
    }
  }

  // Send bulk push notifications
  async sendBulkPushNotifications(notifications) {
    const { sendBulkPushNotifications } = require('../utils/notifications');
    return await sendBulkPushNotifications(notifications);
  }

  // Update emergency status
  async updateEmergencyStatus(emergencyId, status, responderId = null) {
    const client = await this.pgPool.connect();
    try {
      const query = `
        UPDATE emergencies 
        SET status = $1, responder_id = $2, updated_at = $3
        WHERE id = $4
        RETURNING *
      `;

      const result = await client.query(query, [status, responderId, new Date(), emergencyId]);
      
      // Update Redis cache
      const emergencyData = await this.redisClient.get(`emergency:${emergencyId}`);
      if (emergencyData) {
        const data = JSON.parse(emergencyData);
        data.status = status;
        data.responderId = responderId;
        data.updatedAt = new Date();
        await this.redisClient.setEx(`emergency:${emergencyId}`, 3600, JSON.stringify(data));
      }

      return result.rows[0];

    } finally {
      client.release();
    }
  }

  // Get active emergencies
  async getActiveEmergencies() {
    const client = await this.pgPool.connect();
    try {
      const query = `
        SELECT e.*, u.first_name, u.last_name, u.phone
        FROM emergencies e
        LEFT JOIN users u ON e.responder_id = u.id
        WHERE e.status = 'active'
        ORDER BY e.created_at DESC
      `;

      const result = await client.query(query);
      return result.rows;

    } finally {
      client.release();
    }
  }

  // Get emergency by ID
  async getEmergencyById(emergencyId) {
    const client = await this.pgPool.connect();
    try {
      const query = `
        SELECT e.*, u.first_name, u.last_name, u.phone
        FROM emergencies e
        LEFT JOIN users u ON e.responder_id = u.id
        WHERE e.id = $1
      `;

      const result = await client.query(query, [emergencyId]);
      return result.rows[0];

    } finally {
      client.release();
    }
  }

  // Respond to emergency
  async respondToEmergency(emergencyId, responderId, response) {
    try {
      // Update emergency status
      await this.updateEmergencyStatus(emergencyId, 'responded', responderId);

      // Create response record
      const client = await this.pgPool.connect();
      try {
        const query = `
          INSERT INTO emergency_responses (
            emergency_id, responder_id, response, created_at
          ) VALUES ($1, $2, $3, $4)
          RETURNING *
        `;

        const result = await client.query(query, [emergencyId, responderId, response, new Date()]);
        
        // Publish response to MQTT
        publishMessage(`emergency/${emergencyId}/response`, {
          type: 'emergency_response',
          emergencyId,
          responderId,
          response,
          timestamp: new Date()
        });

        return result.rows[0];

      } finally {
        client.release();
      }

    } catch (error) {
      logger.error('Error responding to emergency:', error);
      throw error;
    }
  }

  // Get emergency statistics
  async getEmergencyStats() {
    const client = await this.pgPool.connect();
    try {
      const query = `
        SELECT 
          COUNT(*) as total_emergencies,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_emergencies,
          COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded_emergencies,
          COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_emergencies,
          AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_response_time_minutes
        FROM emergencies
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `;

      const result = await client.query(query);
      return result.rows[0];

    } finally {
      client.release();
    }
  }
}

module.exports = new EmergencyService();
