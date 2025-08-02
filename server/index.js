import dotenv from 'dotenv';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import mongoose from 'mongoose'; // Added for health check

// Debug: Log imported routes
console.log('AuthRoutes:', authRoutes);
console.log('MarketRoutes:', marketRoutes);
console.log('TradeRoutes:', tradeRoutes);

// Add this immediately after loading dotenv
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('ALPACA_API_KEY:', process.env.ALPACA_API_KEY ? 'Set' : 'Not set');
console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
await connectDB();

// Middleware
app.use(express.json());

// Add this after initializing the app but before other routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Optional: More detailed health check including MongoDB
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      status: 'healthy',
      db: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      db: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trade', tradeRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
