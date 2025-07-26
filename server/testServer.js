const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const PORT = 5001;

// Add this at the top of your routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Body Parsing Middleware
app.use(express.json());

// Routes
app.use('/api', apiRouter); // Handles /api/... routes
app.use('/api/auth', authRouter); // Specifically handles /api/auth/... routes

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Network test endpoint
app.get('/network-test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Network connection successful',
    clientIp: req.ip,
    headers: req.headers
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' }); // Changed to JSON
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' }); // Changed to JSON
});

// Start server
const server = app.listen(PORT, '::', () => { // '::' binds to all IPv6 and IPv4 addresses
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server running at http://${host}:${port}/`);
});

// Verify server is running
setTimeout(() => {
  const net = require('net');
  const tester = net.createConnection(PORT, '127.0.0.1');
  tester.on('connect', () => {
    console.log('✅ Server is listening on port', PORT);
    tester.end();
  });
  tester.on('error', (err) => {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  });
}, 100); 