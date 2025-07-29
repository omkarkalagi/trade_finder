import express from 'express';
const router = express.Router();

// Add your authentication routes here
router.post('/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

// Ensure default export
export default router;
