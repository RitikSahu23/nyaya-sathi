// Local development server that uses the proper handler for API calls
// This ensures consistency between dev and production

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateGeminiResponse } from './api/gemini-handler.js';

// Basic environment variable loader for local development
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    }
  });
  console.log('✅ Environment variables loaded from .env.local');
} else {
  console.log('⚠️  .env.local not found, using system environment variables');
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API requests
  if (req.url === '/api/gemini' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        if (!body) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Empty request body' }));
          return;
        }

        let data;
        try {
          data = JSON.parse(body);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
          return;
        }

        const result = await generateGeminiResponse(data);
        
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.body));
      } catch (error) {
        console.error('❌ API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Failed to process request',
          details: error instanceof Error ? error.message : String(error),
        }));
      }
    });
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n✅ Development server running on http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:5173`);
  console.log(`API endpoint: http://localhost:${PORT}/api/gemini`);
  console.log(`\n⚠️  Make sure to run in separate terminals:`);
  console.log(`   1. Ollama: Run "ollama serve" in a terminal`);
  console.log(`   2. Frontend: npm run dev (in another terminal)\n`);
  console.log(`Provider: FORCED TO OLLAMA (Local AI)\n`);
});
