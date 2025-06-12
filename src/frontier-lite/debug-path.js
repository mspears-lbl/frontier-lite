const path = require('path');
const fs = require('fs');

// Get the current directory
const currentDir = __dirname;
console.log('Current directory:', currentDir);

// Build the path to the index.html file
const indexPath = path.join(currentDir, 'dist', 'poc', 'browser', 'index.html');
console.log('Index path:', indexPath);

// Check if the file exists
console.log('File exists:', fs.existsSync(indexPath));

// List the contents of the dist directory
try {
  const distPath = path.join(currentDir, 'dist');
  console.log('Contents of dist directory:', fs.readdirSync(distPath));
  
  const pocPath = path.join(distPath, 'poc');
  console.log('Contents of dist/poc directory:', fs.readdirSync(pocPath));
  
  const browserPath = path.join(pocPath, 'browser');
  console.log('Contents of dist/poc/browser directory:', fs.readdirSync(browserPath));
} catch (err) {
  console.error('Error listing directory:', err);
}
