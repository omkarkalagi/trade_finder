import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { createClient } from 'redis';

// Debug: Log imported routes
console.log('AuthRoutes:', authRoutes);
console.log('MarketRoutes:', marketRoutes);
console.log('TradeRoutes:', tradeRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
await connectDB();

// Middleware
app.use(express.json());

// Redis connection
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false
    }
  });

  redisClient.on('error', err => console.error('Redis error:', err));

  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trade', tradeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
