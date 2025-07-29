import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const requiredFiles = [
  'index.html',
  'assets/index.css',
  'assets/index.js'
];

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

// Check for required files
let missingFiles = [];
requiredFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Build incomplete. Missing files:');
  missingFiles.forEach(file => console.error(`- ${file}`));
  process.exit(1);
}

console.log('✅ Build verified successfully');
process.exit(0);
