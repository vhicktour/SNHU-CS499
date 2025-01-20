/**
 * Main server configuration file
 * Handles Express setup, middleware configuration, and server initialization
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import animalRoutes from './routes/animals.js';

// ============= Configuration Setup =============

/**
 * Load environment variables from .env file
 * Must be called before accessing any process.env variables
 */
dotenv.config();

/**
 * Environment-specific configuration
 */
const CONFIG = {
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    __dirname: path.resolve()
};

// ============= Express App Initialization =============

/**
 * Initialize Express application
 */
const app = express();

/**
 * Configure essential middleware
 * - cors: Enable Cross-Origin Resource Sharing
 * - express.json: Parse JSON request bodies
 * - express.urlencoded: Parse URL-encoded request bodies
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= Database Connection =============

/**
 * Establish MongoDB connection
 * Connection details should be specified in environment variables
 */
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// ============= Route Configuration =============

/**
 * API Routes
 */
app.use('/api/animals', animalRoutes);

/**
 * Health Check Endpoint
 * Used for monitoring and load balancer configuration
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: CONFIG.nodeEnv
    });
});

// ============= Error Handling =============

/**
 * Global Error Handler
 * Catches all unhandled errors and provides appropriate response
 */
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Unhandled Error:', {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        error: err.stack
    });

    // Send error response
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: CONFIG.isDevelopment ? err.message : undefined
    });
});

// ============= Static File Serving =============

/**
 * Production-specific configuration
 * Serves static files and handles client-side routing
 */
if (!CONFIG.isDevelopment) {
    // Serve static files from the React build directory
    app.use(express.static(path.join(CONFIG.dirname, '../frontend/build')));

    // Handle client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(
            CONFIG.dirname,
            '../frontend',
            'build',
            'index.html'
        ));
    });
}

// ============= Server Initialization =============

/**
 * Start the Express server
 * Logs server status and configuration details
 */
app.listen(CONFIG.port, () => {
    console.log('='.repeat(50));
    console.log('Server Status:');
    console.log('-'.repeat(50));
    console.log(`• Environment: ${CONFIG.nodeEnv}`);
    console.log(`• Port: ${CONFIG.port}`);
    console.log(`• Time: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Consider graceful shutdown in production
    if (!CONFIG.isDevelopment) {
        process.exit(1);
    }
});

export default app;