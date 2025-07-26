import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import cluster from 'cluster';
import os from 'os';
import { createClient } from 'redis';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Declare PORT only once at the top level
const PORT = process.env.PORT || 10000;

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Health check route
app.get('/health', (req, res) => {
  console.log('✅ Health check passed');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint redirect
app.get('/', (req, res) => res.redirect('/health'));

// Error handling for uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Cluster setup
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
  console.time('Server startup');

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.timeEnd('Server startup');
    console.log(`✅ Worker ${process.pid} running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);

    // Start async initialization
    initializeServices().catch(console.error);
  });

  async function initializeServices() {
    try {
      console.log("Starting async service initialization...");

      // Connect to Redis
      const redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log("✅ Redis connected");

      // Initialize market data stream
      await initializeMarketDataStream();
      console.log("✅ Market data stream initialized");
    } catch (err) {
      console.error("Initialization error:", err);
    }
  }
}

// Placeholder functions (implement these in separate files)
async function initializeMarketDataStream() {
  // Implement your market data streaming logic
  console.log("Market data stream started");
}

// Start the server in non-cluster mode if not using clustering
if (!cluster.isPrimary) {
  console.time('Server startup');
  app.listen(PORT, '0.0.0.0', () => {
    console.timeEnd('Server startup');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
