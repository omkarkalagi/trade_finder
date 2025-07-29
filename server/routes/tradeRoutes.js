const router = express.Router();

// Add your trade routes here
router.post('/execute', (req, res) => {
  res.json({ message: 'Trade executed' });
});

// Ensure this is the last line in the file
export default router;
