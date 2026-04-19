// Local development server that proxies API calls to Ollama
// This lets us test locally without vercel/serverless complexity

import http from 'http';
import https from 'https';

const SYSTEM_PROMPT = `You answer legal questions about Indian law. Be brief. Cite laws.`;

const server = http.createServer((req, res) => {
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

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { userMessage, chatHistory, language, selectedState } = data;

        if (!userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'userMessage is required' }));
          return;
        }

        // Build prompt that forces direct answer
        let prompt = `You are a legal assistant. Answer the question directly with Indian law references.\n\nQ: ${userMessage}\n\nA:`;

        console.log('📤 Calling Ollama API...');

        // Call Ollama using http.request
        const ollamaData = JSON.stringify({
          model: 'tinyllama',
          prompt: prompt,
          stream: false,
          temperature: 0.1,
        });

        const options = {
          hostname: 'localhost',
          port: 11434,
          path: '/api/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(ollamaData),
          },
        };

        const ollamaReq = http.request(options, (ollamaRes) => {
          let responseData = '';

          ollamaRes.on('data', chunk => {
            responseData += chunk;
          });

          ollamaRes.on('end', () => {
            try {
              if (ollamaRes.statusCode !== 200) {
                throw new Error(`Ollama HTTP ${ollamaRes.statusCode}`);
              }

              const ollamaJson = JSON.parse(responseData);
              let responseText = ollamaJson.response?.trim() || 'No response from Ollama';
              
              // Clean up response: remove various labels that tinyllama might add at start of lines
              responseText = responseText
                .split('\n')
                .map(line => {
                  // Remove question, response, user, assistant, answer labels from line start
                  return line
                    .replace(/^(Question|Response|User|Assistant|Answer):\s*/i, '')
                    .replace(/^(Question|Response):\s*"[^"]*"\s*/i, '');
                })
                .join('\n')
                .replace(/^\n+/, '') // Remove leading newlines
                .trim();
              
              console.log(`✅ Ollama response received (${responseText.length} chars)`);
              console.log(`📝 Response preview: ${responseText.substring(0, 100)}...`);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                response: responseText,
              }));
            } catch (error) {
              console.error('❌ Error parsing Ollama response:', error.message);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: 'Failed to parse Ollama response',
                details: error.message,
              }));
            }
          });
        });

        ollamaReq.on('error', (error) => {
          console.error('❌ Ollama connection error:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Failed to connect to Ollama',
            details: error.message,
            hint: 'Make sure Ollama is running: ollama serve',
          }));
        });

        ollamaReq.write(ollamaData);
        ollamaReq.end();
      } catch (error) {
        console.error('❌ API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Failed to process request',
          details: error.message,
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
  console.log(`API proxy: http://localhost:${PORT}/api/gemini`);
  console.log(`\n⚠️  Make sure you have running in separate terminals:`);
  console.log(`   1. Ollama: ollama serve`);
  console.log(`   2. Frontend: npm run dev (in another terminal)\n`);
});
