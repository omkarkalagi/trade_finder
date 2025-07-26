const express = require('express');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Auth routes
app.post('/api/auth/verify-otp', (req, res) => {
  console.log('OTP Verification Request:', req.body);
  res.json({ success: true, token: 'temp-token' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Clean server running on port ${PORT}`);
}); 