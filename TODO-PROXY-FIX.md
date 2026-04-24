# Priority Fix: Vite Proxy for Backend Server (Fix 400 Error)

## Problem
Frontend /api/gemini → Vite plugin (400 JSON parse) not server.js (Ollama-ready).

## Fix Plan (vite.config.ts)
1. Remove/comment `geminiDevApiPlugin` (Gemini-only).
2. Add proxy:
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```
3. Restart `npm run dev`.

## Expected
Frontend calls → server.js → Ollama (with .env vars).

**Proceed?**
