// Replace ALL require() with import statements
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cluster from 'cluster';
import os from 'os';
import { createClient } from 'redis';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Add above other routes
app.get('/health', async (req, res) => {
  const checks = {
    server: true,
    redis: false,
    uptime: process.uptime()
  };

  try {
    // Fast Redis ping check
    await healthRedis.ping();
    checks.redis = true;
    res.status(200).json(checks);
  } catch (err) {
    // Still respond OK if Redis fails
    res.status(200).json({ ...checks, warning: "Redis unavailable" });
  }
});

// Add this above other routes
app.get('/', (req, res) => res.redirect('/health'));

// ... rest of your application code

// Start server
const PORT = process.env.PORT || 10000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running with ${numCPUs} workers`);

  // Fork workers
  for (let i = 0; i < Math.min(numCPUs, 4); i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker process
  // Create minimal Redis connection for health check
  const healthRedis = createClient({
    url: process.env.REDIS_URL,
    socket: { connectTimeout: 1000 } // 1s timeout
  });

  // Start server immediately
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Start async initialization
    initializeServices();
  });

  async function initializeServices() {
    try {
      console.log("Starting async service initialization...");

      // Connect to Redis with retries
      await connectRedisWithRetry();

      // Initialize market data stream (non-blocking)
      initializeMarketDataStream().catch(console.error);

      console.log("Async initialization complete");
    } catch (err) {
      console.error("Initialization error:", err);
    }
  }

  // Defer heavy initialization
  setTimeout(() => {
    try {
      // Connect to Redis and initialize market data stream
      console.log('Starting delayed initialization');
      // ... your code for heavy operations ...
    } catch (err) {
      console.error('Delayed initialization error:', err);
    }
  }, 30000);
}

// Error handling for uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(rateLimiter);

// Health check route
app.get('/health', (req, res) => {
  console.log('✅ Health check passed');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ... other routes (auth, market, etc.) ...

// Root endpoint redirect
app.get('/', (req, res) => res.redirect('/health'));

// Start the server
console.time('Server startup');
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.timeEnd('Server startup');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Defer heavy operations
setTimeout(() => {
  try {
    // Connect to Redis and initialize market data stream
    console.log('Starting delayed initialization');
    // ... your code for heavy operations ...
  } catch (err) {
    console.error('Delayed initialization error:', err);
  }
}, 30000);
