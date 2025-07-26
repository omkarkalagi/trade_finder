import express from 'express';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';

const PORT = process.env.PORT || 10000;

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

  // Middleware
  app.use(cors({
    origin: [
      'https://trade-finder-three.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true
  }));
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRouter);

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'OK' }));

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
