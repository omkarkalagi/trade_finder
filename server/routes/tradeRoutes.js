import express from 'express';
const router = express.Router();

// Add your trade routes here
router.post('/execute', (req, res) => {
  res.json({ message: 'Trade executed' });
});

// Add this default export
export default router;
