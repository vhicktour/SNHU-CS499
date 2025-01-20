/**
 * Database Connection Configuration
 * Handles MongoDB connection setup, monitoring, and graceful shutdown
 * @module config/db
 */

import mongoose from 'mongoose';

/**
 * MongoDB connection options
 * Configures optimal settings for production use
 */
const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    family: 4  // Use IPv4, skip trying IPv6
};

/**
 * Setup connection monitoring
 * Establishes event listeners for connection state changes
 * @param {mongoose.Connection} connection - Mongoose connection instance
 */
const setupConnectionMonitoring = (connection) => {
    // Successfully connected
    connection.on('connected', () => {
        console.log('='.repeat(50));
        console.log('MongoDB Connection Status: Connected');
        console.log(`Host: ${connection.host}`);
        console.log(`Database: ${connection.name}`);
        console.log(`Port: ${connection.port}`);
        console.log('='.repeat(50));
    });

    // Connection error
    connection.on('error', (err) => {
        console.error('MongoDB Connection Error:', {
            timestamp: new Date().toISOString(),
            error: err.message,
            stack: err.stack
        });
    });

    // Connection lost
    connection.on('disconnected', () => {
        console.log('='.repeat(50));
        console.log('MongoDB Connection Status: Disconnected');
        console.log('Timestamp:', new Date().toISOString());
        console.log('='.repeat(50));
    });

    // Connection reconnected
    connection.on('reconnected', () => {
        console.log('='.repeat(50));
        console.log('MongoDB Connection Status: Reconnected');
        console.log('Timestamp:', new Date().toISOString());
        console.log('='.repeat(50));
    });
};

/**
 * Setup graceful shutdown handlers
 * Ensures proper database disconnection on application termination
 */
const setupGracefulShutdown = () => {
    const shutdown = async (signal) => {
        try {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            
            // Set a timeout for the shutdown process
            const shutdownTimeout = setTimeout(() => {
                console.error('Could not close MongoDB connection in time, forcefully shutting down');
                process.exit(1);
            }, 10000);

            // Attempt to close database connection
            await mongoose.connection.close();
            
            clearTimeout(shutdownTimeout);
            console.log('MongoDB connection closed successfully');
            process.exit(0);
        } catch (err) {
            console.error('Error during graceful shutdown:', err);
            process.exit(1);
        }
    };

    // Handle different termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // Nodemon restart
};

/**
 * Validates MongoDB URI
 * Ensures the connection string is properly formatted
 * @param {string} uri - MongoDB connection URI
 * @throws {Error} If URI is invalid or missing
 */
const validateMongoURI = (uri) => {
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    const mongoURIPattern = /^mongodb(\+srv)?:\/\/.+/;
    if (!mongoURIPattern.test(uri)) {
        throw new Error('Invalid MongoDB URI format');
    }
};

/**
 * Connects to MongoDB
 * Establishes and manages database connection with error handling
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        // Validate MongoDB URI
        validateMongoURI(process.env.MONGODB_URI);

        // Initialize connection
        const conn = await mongoose.connect(process.env.MONGODB_URI, MONGO_OPTIONS);

        // Setup monitoring and shutdown handlers
        setupConnectionMonitoring(conn.connection);
        setupGracefulShutdown();

        // Enable debugging in development
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }

    } catch (error) {
        console.error('Failed to connect to MongoDB:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        });
        
        // Exit process on connection failure
        process.exit(1);
    }
};

export default connectDB;