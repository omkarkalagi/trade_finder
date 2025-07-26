require('module-alias/register');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { securityHeaders, apiLimiter, sanitizeData, sessionSecurity } = require('./middleware/security');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const stockRoutes = require('./routes/stockRoutes');
const aiRoutes = require('./routes/aiRoutes');
const newsRoutes = require('@routes/newsRoutes');
const algoRoutes = require('./routes/algoRoutes');
const autoTradingRoutes = require('./routes/autoTradingRoutes');
const marketRoutes = require('./routes/marketRoutes');
const kiteRoutes = require('@routes/kiteRoutes');
const compression = require('compression');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { trainTradingModel } = require('@/services/modelTrainingService');
const redis = require('redis');
const { createClient } = require('@redis/client');
const jwt = require('jsonwebtoken'); // Add this at the top
require('dotenv').config(); // Load environment variables first
const dns = require('dns');
const path = require('path');
console.log('Current directory:', __dirname);
console.log('Files in directory:', require('fs').readdirSync(__dirname));

dns.lookup('localhost', (err, address) => {
  console.log(`DNS resolution: localhost -> ${address}`);
});

// Heavy training on startup
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Safe model training with error handling
  trainTradingModel()
    .then(() => console.log('Initial model training completed'))
    .catch(err => console.error('Initial training failed:', err.message)); // Log only message
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
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
    'https://your-frontend-url.vercel.app', // Your Vercel frontend URL
    'https://your-backend-url.onrender.com' // Your Render backend URL
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
  app.use('/api/auth', require('./routes/auth')); // Fixed path
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
  
  // Server-side rendering for critical pages
  // app.get(['/', '/dashboard', '/login'], (req, res) => {
  //   const context = { auth: {} };
  //   const html = render(req.url, context);
  //   res.send(html);
  // });
  
  // Static files with caching
  app.use(express.static('client/build', {
    maxAge: '1y',
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
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

  // Start server
  app.listen(PORT, '127.0.0.1', () => { // Use 127.0.0.1 instead of 0.0.0.0
    console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
    
    try {
      // Start market data stream
      require('@/services/marketDataService').initMarketDataStream();
    } catch (err) {
      console.error('Failed to start market data stream:', err);
    }
    
    // Schedule periodic model training
    setInterval(() => {
      trainTradingModel()
        .then(() => console.log('Periodic model training completed'))
        .catch(err => console.error('Periodic training failed', err));
    }, 2 * 60 * 60 * 1000); // Every 2 hours
  });
} 