# Local Development Setup for NyayaSathi

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Either Gemini API key OR Ollama running locally

### Option 1: Using Google Gemini API (Recommended for Development)

1. **Get your free Gemini API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the key (starts with `AIza...`)

2. **Create `.env.local` in the root directory:**
   ```
   GEMINI_API_KEY=your-api-key-here
   AI_PROVIDER=gemini
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   This starts Vite on `http://localhost:5173`

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

✅ **That's it!** The API calls are automatically proxied by Vite to the handler.

---

### Option 2: Using Local Ollama

If you want to use Ollama instead:

1. **Install and run Ollama:**
   ```bash
   # Download from https://ollama.com
   # Then start it:
   ollama serve
   ```

2. **Create `.env.local`:**
   ```
   OLLAMA_API_URL=http://127.0.0.1:11434
   OLLAMA_MODEL=phi3.5:latest
   AI_PROVIDER=ollama
   ```

3. **Install dependencies and start:**
   ```bash
   npm install
   npm run dev
   ```

---

### Option 3: Using Separate Backend Server + Frontend

If you prefer to run backend and frontend separately:

1. **Terminal 1 - Start the backend server:**
   ```bash
   node server.js
   ```
   This starts on `http://localhost:3000`
   
2. **Terminal 2 - Start the frontend:**
   ```bash
   # Modify vite.config.ts to point to localhost:3000 (see below)
   npm run dev
   ```

**To point frontend to port 3000:**
Edit `vite.config.ts` and modify the middleware path, or comment it out and update `src/gemini.ts` to use:
```typescript
const response = await fetch('http://localhost:3000/api/gemini', {
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `AI_PROVIDER` | Which AI to use | `gemini` or `ollama` |
| `OLLAMA_API_URL` | Ollama endpoint | `http://127.0.0.1:11434` |
| `OLLAMA_MODEL` | Which Ollama model to use | `phi3.5:latest` or `mistral` |

---

## Troubleshooting

### ❌ "Failed to load resource: 500 Internal Server Error"

**Cause:** Backend isn't processing requests correctly.

**Fix:**
1. Check `.env.local` has the right API key
2. If using Ollama, ensure it's running: `ollama serve`
3. Check backend logs in terminal for detailed error
4. Try Option 1 (Gemini) first - it's simpler

### ❌ "Cannot connect to backend"

**Cause:** Vite dev server isn't routing `/api/gemini` correctly.

**Fix:**
1. Make sure you're running `npm run dev` (not `node server.js`)
2. Check that `vite.config.ts` is not modified
3. Restart the dev server

### ❌ "Invalid API Key"

**Cause:** Gemini API key is wrong or invalid.

**Fix:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Check your key - it should start with `AIza`
3. If expired, delete and create a new one
4. Update `.env.local` and restart

### ❌ Ollama model not found

**Cause:** Model not downloaded yet.

**Fix:**
```bash
# Download the model
ollama pull phi3.5:latest

# Or use another model
ollama pull mistral
```

---

## What's Fixed

- ✅ `server.js` now uses the proper `generateGeminiResponse` handler
- ✅ API returns properly formatted responses
- ✅ Better error messages for debugging
- ✅ Support for both Gemini and Ollama providers
- ✅ Consistent behavior between dev and production

---

## Next Steps

- **For Production:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **For Ollama Setup:** See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)
