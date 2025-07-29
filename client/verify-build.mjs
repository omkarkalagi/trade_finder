import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const requiredPatterns = [
  /index\.html$/, // Should match index.html
  /assets\/index\.[a-f0-9]+\.css$/, // Match any hash length
  /assets\/index\.[a-f0-9]+\.js$/   // Match any hash length
];

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

// Get all files in dist directory
const allFiles = [];
const walkDir = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else {
      allFiles.push(path.relative(distDir, filePath).replace(/\\/g, '/'));
    }
  }
};
walkDir(distDir);

// Check for required file patterns
let missingFiles = [];
requiredPatterns.forEach(pattern => {
  if (!allFiles.some(file => pattern.test(file))) {
    missingFiles.push(pattern.toString());
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Build incomplete. Missing files matching patterns:');
  missingFiles.forEach(pattern => console.error(`- ${pattern}`));
  console.log('Found files:', allFiles);
  process.exit(1);
}

console.log('✅ Build verified successfully');
console.log('Found files:', allFiles);
process.exit(0);
