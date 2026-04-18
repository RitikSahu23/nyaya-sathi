// Local development server that proxies API calls to Ollama
// This lets us test locally without vercel/serverless complexity

import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SYSTEM_PROMPT = `You are NyayaSathi, an AI legal information assistant for India. You provide ONLY general legal information, never personalized legal advice.

YOUR CORE IDENTITY:
- Name: NyayaSathi (Justice Companion)
- Role: Legal Information Assistant
- Jurisdiction: India (all central and state laws)

YOUR RULES:
1. ALWAYS cite relevant Indian laws with section numbers (IPC, Consumer Protection Act, RTI, MTA 2021, etc.)
2. EXPLAIN simply: Grade-8 level language. Avoid heavy jargon.
3. NEVER give personalized legal strategy. Use "You may consider...", "Consult a licensed advocate..."
4. INCLUDE disclaimer at end of EVERY response
5. For sensitive topics: provide helplines (Women Helpline 181, Police 100, NALSA 15100, Tele-Law 15100)
6. STATE-SPECIFIC: Mention relevant state laws alongside central laws
7. Cover ALL AREAS of Indian law - Criminal, Civil, Family, Property, Tenant/Landlord, Consumer, Labour, Constitutional, RTI, POSH, DV Act, IT Act, etc.`;

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
        const data = JSON.parse(body);
        const { userMessage, chatHistory, language, selectedState } = data;

        if (!userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'userMessage is required' }));
          return;
        }

        // Build conversation history
        let conversationText = SYSTEM_PROMPT + '\n\n---\n\n';

        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
          for (const msg of chatHistory) {
            const role = msg.role === 'model' ? 'Assistant' : 'User';
            const content = msg.parts?.[0]?.text || msg.content || '';
            if (content) {
              conversationText += `${role}: ${content}\n\n`;
            }
          }
        }

        conversationText += `User: ${userMessage}\n\nAssistant: `;

        console.log('Calling Ollama API...');

        // Call Ollama
        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'mistral',
            prompt: conversationText,
            stream: false,
            temperature: 0.4,
          }),
        });

        if (!ollamaRes.ok) {
          throw new Error(`Ollama error: ${ollamaRes.status}`);
        }

        const ollamaData = await ollamaRes.json();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          response: ollamaData.response.trim(),
        }));
      } catch (error) {
        console.error('API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Failed to process request',
          details: error.message,
        }));
      }
    });
    return;
  }

  // Serve Vite frontend
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n✅ Development server running on http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:5173 (run 'npm run dev' in another terminal)`);
  console.log(`API proxy: http://localhost:${PORT}/api/gemini`);
  console.log(`\nMake sure Ollama is running: ollama serve\n`);
});
