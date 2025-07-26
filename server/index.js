// Replace ALL require() with import statements
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cluster from 'cluster';
import os from 'os';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Add above other routes
app.get('/health', (req, res) => {
  // Add minimal logic - avoid DB/Redis checks
  res.status(200).json({ status: 'OK' });
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
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Defer heavy initialization
  setTimeout(() => {
    try {
      connectToRedis();
      initializeMarketDataStream();
      console.log('Delayed initialization complete');
    } catch (err) {
      console.error('Delayed init error:', err);
    }
  }, 30000);
}
