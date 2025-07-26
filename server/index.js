import express from 'express';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';

const PORT = process.env.PORT || 10000;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} running`);
  for (let i = 0; i < Math.min(os.cpus().length, 4); i++) {
    cluster.fork();
  }
} else {
  const app = express();
  app.use(cors({
    origin: [
      'https://trade-finder-three.vercel.app',
      'http://localhost:3000' // Keep for local development
    ],
    credentials: true
  }));
  app.get('/health', (req, res) => res.json({ status: 'OK' }));
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
