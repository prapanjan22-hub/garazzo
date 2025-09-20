const mongoose = require('mongoose');
const { Pool } = require('pg');
const redis = require('redis');
const logger = require('../utils/logger');

// Connection states
const connectionState = {
  mongodb: false,
  postgres: false,
  redis: false
};

// Configure MongoDB with retry logic
const connectMongoDB = async (retries = 5, interval = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 30000
      };

      await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
      connectionState.mongodb = true;
      logger.info('✅ MongoDB connected successfully');
      
      // Set up connection monitoring
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
        connectionState.mongodb = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
        connectionState.mongodb = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected successfully');
        connectionState.mongodb = true;
      });

      return true;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed:`, error.message);
      if (attempt === retries) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn('Running in development mode without MongoDB');
          return false;
        }
        throw new Error('Failed to connect to MongoDB after multiple attempts');
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

// Configure PostgreSQL with connection pool and retry logic
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const connectPostgres = async (retries = 5, interval = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pgPool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      connectionState.postgres = true;
      logger.info('✅ PostgreSQL connected successfully');

      // Set up error handling for pool
      pgPool.on('error', (err) => {
        logger.error('PostgreSQL pool error:', err);
        connectionState.postgres = false;
      });

      return true;
    } catch (error) {
      logger.error(`PostgreSQL connection attempt ${attempt} failed:`, error.message);
      if (attempt === retries) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn('Running in development mode without PostgreSQL');
          return false;
        }
        throw new Error('Failed to connect to PostgreSQL after multiple attempts');
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

// Configure Redis with retry logic
let redisClient = null;

const connectRedis = async (retries = 5, interval = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      redisClient = redis.createClient({
        url: process.env.REDIS_URL,
        retry_strategy: function(options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('Redis server refused connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      redisClient.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        connectionState.redis = false;
      });

      redisClient.on('connect', () => {
        logger.info('✅ Redis connected successfully');
        connectionState.redis = true;
      });

      redisClient.on('reconnecting', () => {
        logger.warn('Redis reconnecting...');
      });

      await redisClient.connect();
      return true;
    } catch (error) {
      logger.error(`Redis connection attempt ${attempt} failed:`, error.message);
      if (attempt === retries) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn('Running in development mode without Redis');
          return false;
        }
        throw new Error('Failed to connect to Redis after multiple attempts');
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

// Main connection function with health checks
const connectDatabases = async () => {
  try {
    const results = await Promise.allSettled([
      connectMongoDB(),
      connectPostgres(),
      connectRedis()
    ]);

    const failedConnections = results
      .map((result, index) => {
        if (result.status === 'rejected') {
          return ['MongoDB', 'PostgreSQL', 'Redis'][index];
        }
        return null;
      })
      .filter(Boolean);

    if (failedConnections.length > 0) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to connect to: ${failedConnections.join(', ')}`);
      } else {
        logger.warn(`Running with limited functionality. Failed services: ${failedConnections.join(', ')}`);
      }
    }

    return {
      pgPool,
      redisClient,
      connectionState
    };
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

// Health check function
const checkDatabaseHealth = async () => {
  const health = {
    mongodb: false,
    postgres: false,
    redis: false,
    details: {}
  };

  try {
    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      health.mongodb = true;
    }
    health.details.mongodb = {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState
    };
  } catch (error) {
    health.details.mongodb = { error: error.message };
  }

  try {
    // Check PostgreSQL
    const client = await pgPool.connect();
    await client.query('SELECT 1');
    client.release();
    health.postgres = true;
    health.details.postgres = { status: 'connected' };
  } catch (error) {
    health.details.postgres = { error: error.message };
  }

  try {
    // Check Redis
    if (redisClient && redisClient.isReady) {
      health.redis = true;
      health.details.redis = { status: 'connected' };
    }
  } catch (error) {
    health.details.redis = { error: error.message };
  }

  return health;
};

// Graceful shutdown function
const closeDatabaseConnections = async () => {
  try {
    // Close MongoDB connection
    if (mongoose.connection) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    }

    // Close PostgreSQL pool
    if (pgPool) {
      await pgPool.end();
      logger.info('PostgreSQL connection pool closed');
    }

    // Close Redis connection
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis connection closed');
    }
  } catch (error) {
    logger.error('Error during database shutdown:', error);
    throw error;
  }
};

// Get database connections
const getPostgresPool = () => pgPool;
const getRedisClient = () => redisClient;
const getConnectionState = () => ({ ...connectionState });

module.exports = {
  connectDatabases,
  getPostgresPool,
  getRedisClient,
  getConnectionState,
  checkDatabaseHealth,
  closeDatabaseConnections
};
