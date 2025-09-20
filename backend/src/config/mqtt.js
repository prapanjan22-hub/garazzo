const mqtt = require('mqtt');
const logger = require('../utils/logger');

let mqttClient;

const initializeMQTT = () => {
  try {
    const mqttUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    const options = {
      keepalive: 60,
      reconnectPeriod: 5000,
      connectTimeout: 30 * 1000,
      clean: true,
      clientId: `garazzo_backend_${Math.random().toString(16).slice(2, 8)}`,
      rejectUnauthorized: false
    };

    if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
      options.username = process.env.MQTT_USERNAME;
      options.password = process.env.MQTT_PASSWORD;
    }

    mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883', options);

    mqttClient.on('connect', () => {
      logger.info('✅ MQTT Broker connected successfully');
      
      // Subscribe to vehicle data topics
      mqttClient.subscribe('vehicle/+/data', (err) => {
        if (err) {
          logger.error('MQTT subscription error:', err);
        } else {
          logger.info('Subscribed to vehicle data topics');
        }
      });

      // Subscribe to emergency topics
      mqttClient.subscribe('vehicle/+/emergency', (err) => {
        if (err) {
          logger.error('MQTT emergency subscription error:', err);
        } else {
          logger.info('Subscribed to emergency topics');
        }
      });

      // Subscribe to diagnostic topics
      mqttClient.subscribe('vehicle/+/diagnostic', (err) => {
        if (err) {
          logger.error('MQTT diagnostic subscription error:', err);
        } else {
          logger.info('Subscribed to diagnostic topics');
        }
      });
    });

    mqttClient.on('error', (err) => {
      logger.error('MQTT connection error:', err);
    });

    mqttClient.on('reconnect', () => {
      logger.info('MQTT reconnecting...');
    });

    mqttClient.on('close', () => {
      logger.info('MQTT connection closed');
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        handleMQTTMessage(topic, data);
      } catch (error) {
        logger.error('Error parsing MQTT message:', error);
      }
    });

  } catch (error) {
    logger.error('Failed to initialize MQTT:', error);
  }
};

const handleMQTTMessage = (topic, data) => {
  const topicParts = topic.split('/');
  const deviceType = topicParts[0]; // 'vehicle'
  const deviceId = topicParts[1];
  const messageType = topicParts[2]; // 'data', 'emergency', 'diagnostic'

  logger.info(`MQTT Message received - Topic: ${topic}, Device: ${deviceId}, Type: ${messageType}`);

  switch (messageType) {
    case 'data':
      handleVehicleData(deviceId, data);
      break;
    case 'emergency':
      handleEmergencyAlert(deviceId, data);
      break;
    case 'diagnostic':
      handleDiagnosticData(deviceId, data);
      break;
    default:
      logger.warn(`Unknown message type: ${messageType}`);
  }
};

const handleVehicleData = (deviceId, data) => {
  // Store vehicle data in MongoDB
  const VehicleData = require('../models/VehicleData');
  
  const vehicleData = new VehicleData({
    deviceId,
    timestamp: new Date(),
    location: data.location,
    speed: data.speed,
    fuelLevel: data.fuelLevel,
    engineTemperature: data.engineTemperature,
    batteryVoltage: data.batteryVoltage,
    odometer: data.odometer,
    tirePressure: data.tirePressure,
    engineStatus: data.engineStatus,
    rawData: data
  });

  vehicleData.save()
    .then(() => {
      logger.info(`Vehicle data saved for device ${deviceId}`);
    })
    .catch((error) => {
      logger.error(`Error saving vehicle data for device ${deviceId}:`, error);
    });
};

const handleEmergencyAlert = (deviceId, data) => {
  logger.warn(`Emergency alert from device ${deviceId}:`, data);
  
  // Notify emergency services
  const EmergencyService = require('../services/emergencyService');
  EmergencyService.handleEmergencyAlert(deviceId, data);
};

const handleDiagnosticData = (deviceId, data) => {
  logger.info(`Diagnostic data from device ${deviceId}:`, data);
  
  // Store diagnostic data
  const DiagnosticData = require('../models/DiagnosticData');
  
  const diagnosticData = new DiagnosticData({
    deviceId,
    timestamp: new Date(),
    errorCodes: data.errorCodes,
    warnings: data.warnings,
    maintenanceAlerts: data.maintenanceAlerts,
    rawData: data
  });

  diagnosticData.save()
    .then(() => {
      logger.info(`Diagnostic data saved for device ${deviceId}`);
    })
    .catch((error) => {
      logger.error(`Error saving diagnostic data for device ${deviceId}:`, error);
    });
};

const publishMessage = (topic, message) => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, JSON.stringify(message), (err) => {
      if (err) {
        logger.error('MQTT publish error:', err);
      } else {
        logger.info(`Message published to topic ${topic}`);
      }
    });
  } else {
    logger.error('MQTT client not connected');
  }
};

const getMQTTClient = () => mqttClient;

module.exports = {
  initializeMQTT,
  publishMessage,
  getMQTTClient
};
