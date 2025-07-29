import express from 'express';
const router = express.Router();

// Add your market data routes here
router.get('/data', (req, res) => {
  res.json({ message: 'Market data' });
});

// Ensure default export
export default router;
