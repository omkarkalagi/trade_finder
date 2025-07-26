import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { securityHeaders, apiLimiter, sanitizeData, sessionSecurity } from './middleware/security';
import authRoutes from './routes/auth.js';
import tradeRoutes from './routes/tradeRoutes.js';
import stockRoutes from './routes/stockRoutes';
import aiRoutes from './routes/aiRoutes';
import newsRoutes from '@routes/newsRoutes';
import algoRoutes from './routes/algoRoutes';
import autoTradingRoutes from './routes/autoTradingRoutes';
import marketRoutes from './routes/marketRoutes';
import kiteRoutes from '@routes/kiteRoutes';
import compression from 'compression';
import cluster from 'cluster';
import { cpus } from 'os';
import { trainTradingModel } from '@/services/modelTrainingService';
import redis from 'redis';
import { createClient } from '@redis/client';
import jwt from 'jsonwebtoken'; // Add this at the top
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first
import dns from 'dns';
import path from 'path';
console.log('Current directory:', __dirname);
console.log('Files in directory:', require('fs').readdirSync(__dirname));

dns.lookup('localhost', (err, address) => {
  console.log(`DNS resolution: localhost -> ${address}`);
});

// Heavy training on startup
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Disable intensive training on startup
  // trainTradingModel()
  //   .then(() => console.log('Initial model training completed'))
  //   .catch(err => console.error('Initial training failed:', err));

  // Fork workers
  for (let i = 0; i < Math.min(numCPUs, 2); i++) { // Limit to 2 workers
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker process
  const app = express();
  const PORT = process.env.PORT || 5001; // Change to 5001

  // Add this temporary test route BEFORE any other middleware
  app.get('/test', (req, res) => {
    res.send('Server is working!');
  });

  // Apply security middleware
  app.use(securityHeaders);
  app.use(apiLimiter);
  app.use(sanitizeData);
  app.use(sessionSecurity);

  // Apply performance middleware
  // Remove the problematic compression middleware usage
  // app.use(compression());

  // Instead, use this safe approach:
  try {
    const compression = require('compression');
    app.use(compression());
    console.log('✅ Compression middleware enabled');
  } catch (e) {
    console.warn('⚠️ Compression module not available. Skipping.');
  }
  app.use(express.json({ limit: '10kb' }));

  // Update CORS configuration
  const allowedOrigins = [
    'https://trade-finder-three.vercel.app'
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Database connection
  // Temporarily comment out database connection
  // mongoose.connect(process.env.MONGODB_URI)
  //   .then(() => console.log(`Worker ${process.pid} connected to MongoDB`))
  //   .catch(err => console.error('MongoDB connection error:', err));

  // Redis connection
  let redisClient;
  try {
    if (process.env.REDIS_URL) {
      redisClient = createClient({
        url: process.env.REDIS_URL,
        socket: {
          tls: true,
          rejectUnauthorized: false
        }
      });
    } else {
      // Fallback to local Redis
      redisClient = createClient();
    }

    redisClient.on('error', err => console.error('Redis error:', err));
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection failed:', err.message);
  }

  // API routes
  app.use('/api/auth', authRoutes); // Fixed path
  app.use('/api/trade', tradeRoutes);
  app.use('/api/stock', stockRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/algo-trading', algoRoutes);
  app.use('/api/auto-trading', autoTradingRoutes);
  app.use('/api/market', marketRoutes);
  app.use('/api/kite', kiteRoutes);

  // Add a test route
  app.get('/api', (req, res) => {
    res.json({ message: 'Backend is running!' });
  });

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Server-side rendering for critical pages
  // app.get(['/', '/dashboard', '/login'], (req, res) => {
  //   const context = { auth: {} };
  //   const html = render(req.url, context);
  //   res.send(html);
  // });

  // Static files with caching
  app.use(express.static(path.join(__dirname, '../../client/build'), {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.html') {
        res.setHeader('Cache-Control', 'public, max-age=0');
      }
    }
  }));

  // Add this global error handler at the end of your middleware chain
  app.use((err, req, res, next) => {
    console.error('🔥 Global Error Handler:', err.stack); // Log full stack trace
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Add detailed logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Basic 404 handler
  app.use((req, res) => {
    res.status(404).send('Not found');
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
  });

  // Add above other routes
  app.get('/debug', (req, res) => {
    res.json({
      status: 'working',
      time: new Date(),
      environment: process.env.NODE_ENV,
      memory: process.memoryUsage()
    });
  });

  // Start server
  app.listen(process.env.PORT || 5001, '0.0.0.0', () => { // Use 127.0.0.1 instead of 0.0.0.0
    console.log(`✅ Server running on port ${process.env.PORT}`);

    try {
      // Start market data stream
      require('@/services/marketDataService').initMarketDataStream();
    } catch (err) {
      console.error('Failed to start market data stream:', err);
    }

    // Comment out periodic training
    // setInterval(() => {
    //   trainTradingModel()
    //     .then(() => console.log('Periodic model training completed'))
    //     .catch(err => console.error('Periodic training failed', err));
    // }, 2 * 60 * 60 * 1000);
  });
}
