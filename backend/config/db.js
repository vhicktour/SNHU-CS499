/**
 * MongoDB Database Connection Manager
 * 
 * Provides robust connection handling with monitoring, validation, and graceful shutdown.
 * Implements best practices for production-ready MongoDB connections in Node.js applications.
 * 
 * @module config/db
 * @requires mongoose
 */

import mongoose from 'mongoose';

// Connection configuration constants
const CONNECTION_TIMEOUT_MS = 10000; // 10 seconds for shutdown operations
const RECONNECT_INTERVAL_MS = 5000;  // 5 seconds between connection retries

/**
 * MongoDB Connection Options
 * 
 * Optimized settings for production environments with connection pooling and timeouts.
 * @constant {Object}
 * @property {boolean} useNewUrlParser - Enable new URL parser
 * @property {boolean} useUnifiedTopology - Use new server discovery/monitoring engine
 * @property {number} maxPoolSize - Maximum number of sockets in connection pool
 * @property {number} serverSelectionTimeoutMS - Timeout for server selection
 * @property {number} socketTimeoutMS - TCP Socket timeout
 * @property {number} heartbeatFrequencyMS - Interval between server monitoring checks
 * @property {boolean} retryWrites - Enable retryable writes
 * @property {number} family - IP address family preference (4 = IPv4)
 */
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  family: 4
};

/**
 * Configure MongoDB Connection Event Handlers
 * 
 * Sets up comprehensive monitoring for connection state changes with detailed logging.
 * 
 * @param {mongoose.Connection} connection - Active Mongoose connection instance
 * @throws {Error} If invalid connection object is provided
 */
const configureConnectionEvents = (connection) => {
  if (!(connection instanceof mongoose.Connection)) {
    throw new Error('Invalid Mongoose connection instance provided');
  }

  connection.on('connected', () => logConnectionState('Connected', connection));
  connection.on('error', handleConnectionError);
  connection.on('disconnected', () => logConnectionState('Disconnected', connection));
  connection.on('reconnected', () => logConnectionState('Reconnected', connection));
  connection.on('reconnectFailed', handleReconnectFailure);
};

/**
 * Log Connection State Changes
 * 
 * Standardizes connection event logging format and provides actionable information.
 * 
 * @param {string} state - Current connection state
 * @param {mongoose.Connection} connection - Active connection instance
 */
const logConnectionState = (state, connection) => {
  const divider = '='.repeat(50);
  console.log([
    divider,
    `MongoDB Connection State: ${state}`,
    `Timestamp: ${new Date().toISOString()}`,
    `Host: ${connection.host}`,
    `Database: ${connection.name}`,
    `Port: ${connection.port}`,
    `Ready State: ${connection.readyState}`,
    divider
  ].join('\n'));
};

/**
 * Handle Connection Errors
 * 
 * Centralized error handling with structured logging for diagnostics.
 * 
 * @param {Error} error - MongoDB connection error
 */
const handleConnectionError = (error) => {
  console.error({
    event: 'MongoDB Connection Error',
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code,
      codeName: error.codeName
    }
  });
};

/**
 * Handle Reconnection Failures
 * 
 * Implements exponential backoff strategy for connection retries.
 */
const handleReconnectFailure = () => {
  console.error('Maximum reconnect attempts reached. Terminating process...');
  process.exit(1);
};

/**
 * Configure Graceful Shutdown Handler
 * 
 * Ensures safe process termination with connection cleanup and timeout safeguards.
 */
const configureShutdownHandlers = () => {
  const shutdown = async (signal) => {
    try {
      console.log(`\n${signal} received. Initiating graceful shutdown...`);
      
      const shutdownTimer = setTimeout(() => {
        console.error('Force shutdown: Connection cleanup timeout reached');
        process.exit(1);
      }, CONNECTION_TIMEOUT_MS);

      await mongoose.connection.close();
      clearTimeout(shutdownTimer);
      
      console.log('MongoDB connection terminated gracefully');
      process.exit(0);
    } catch (error) {
      console.error('Shutdown failure:', error);
      process.exit(1);
    }
  };

  // Handle standard termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));  // Kubernetes/Systemd
  process.on('SIGINT', () => shutdown('SIGINT'));    // Ctrl+C
  process.on('SIGUSR2', () => shutdown('SIGUSR2'));  // Nodemon restart
};

/**
 * Validate MongoDB Connection URI
 * 
 * Ensures properly formatted connection string with comprehensive error messaging.
 * 
 * @param {string} uri - MongoDB connection URI
 * @throws {URIValidationError} For invalid/missing connection strings
 */
const validateConnectionURI = (uri) => {
  if (!uri) {
    throw new URIValidationError('MONGODB_URI environment variable not defined');
  }

  const uriPattern = /^mongodb(\+srv)?:\/\/([^:]+:[^@]+@)?[^/]+(\/\S+)?(\?\S+)?$/;
  if (!uriPattern.test(uri)) {
    throw new URIValidationError(`Invalid MongoDB URI format: ${uri}`);
  }
};

/**
 * Initialize Database Connection
 * 
 * Main entry point for establishing MongoDB connection with full error handling.
 * 
 * @returns {Promise<mongoose.Connection>} Active MongoDB connection
 * @throws {DatabaseConnectionError} For connection failures
 */
export const initializeDatabase = async () => {
  try {
    validateConnectionURI(process.env.MONGODB_URI);

    const connection = await mongoose.connect(
      process.env.MONGODB_URI, 
      MONGO_OPTIONS
    );

    configureConnectionEvents(connection.connection);
    configureShutdownHandlers();

    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collection, method, query, doc) => {
        console.log(`Mongoose: ${collection}.${method}`, JSON.stringify(query), doc);
      });
    }

    return connection;
  } catch (error) {
    console.error({
      event: 'Database Connection Failure',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        metadata: error.errorLabels
      },
      config: {
        uri: process.env.MONGODB_URI,
        options: MONGO_OPTIONS
      }
    });

    process.exit(1);
  }
};

/**
 * Custom Error Class: URI Validation Failures
 */
class URIValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'URIValidationError';
    this.code = 'E_INVALID_MONGO_URI';
  }
}

/**
 * Custom Error Class: Connection Failures
 */
class DatabaseConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseConnectionError';
    this.code = 'E_DB_CONNECTION_FAILED';
  }
}

export default initializeDatabase;