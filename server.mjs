#!/usr/bin/env node
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const PUBLIC_DIR = join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  try {
    // Parse URL and remove query string
    let filePath = req.url.split('?')[0];
    
    // Default to index.html for root
    if (filePath === '/') {
      filePath = '/index.html';
    }
    
    // Build full path
    const fullPath = join(PUBLIC_DIR, filePath);
    
    // Get file extension for MIME type
    const ext = extname(fullPath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    // Read and serve file
    const content = await readFile(fullPath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    
    console.log(`✓ ${req.method} ${req.url} → ${filePath}`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.log(`✗ ${req.method} ${req.url} → 404 Not Found`);
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      console.error(`✗ ${req.method} ${req.url} →`, error);
    }
  }
});

server.listen(PORT, () => {
  console.log(`🚀 CreatorDash server running at http://localhost:${PORT}/`);
  console.log(`📂 Serving files from: ${PUBLIC_DIR}`);
  console.log(`\nAvailable pages:`);
  console.log(`  • http://localhost:${PORT}/`);
  console.log(`  • http://localhost:${PORT}/privacy.html`);
  console.log(`  • http://localhost:${PORT}/terms.html`);
  console.log(`\nPress Ctrl+C to stop`);
});
