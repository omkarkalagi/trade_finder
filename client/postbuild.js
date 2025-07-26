const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

// Fix relative paths
let content = fs.readFileSync(indexPath, 'utf8');
content = content.replace(/href="\//g, 'href="./');
content = content.replace(/src="\//g, 'src="./');
fs.writeFileSync(indexPath, content, 'utf8');
