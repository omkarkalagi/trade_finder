import express from 'express';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';
import { createClient } from 'redis';

const PORT = process.env.PORT || 10000;

// Add near the top
require('dotenv').config();
require('./services/marketSocket'); // Start WebSocket server

// Import routes at the top level (outside conditionals)
import authRouter from './routes/auth.js';

// Cluster setup
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} running`);
  for (let i = 0; i < Math.min(os.cpus().length, 4); i++) {
    cluster.fork();
  }
} else {
  const app = express();

  // Temporary CORS: allow all
  app.use(cors({
    origin: [
      'https://trade-finder-*-omkar-ds-projects.vercel.app', // Allow all Vercel previews
      'https://trade-finder.vercel.app', // Your production domain
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(express.json());
  app.use('/api/auth', authRouter);
  app.get('/health', (req, res) => res.json({ status: 'OK' }));

  // Redis connection
  if (process.env.REDIS_URL) {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false
      }
    });

    redisClient.on('error', err => console.error('Redis error:', err));

    await redisClient.connect()
      .then(() => console.log('✅ Redis connected'))
      .catch(err => console.error('❌ Redis connection failed:', err));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}

console.log(`Using Redis: ${process.env.REDIS_URL ? 'Yes' : 'No'}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Missing'}`);
