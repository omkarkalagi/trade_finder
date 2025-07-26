// Replace ALL require() with import statements
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Add above other routes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Add this above other routes
app.get('/', (req, res) => {
  res.redirect('/health');
});

// ... rest of your application code

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
