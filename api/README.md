# NyayaSathi - Backend Setup

This directory contains the serverless backend for NyayaSathi that:
- Uses HuggingFace Inference API (free, no quota limits)
- Hides API credentials from users
- Provides a clean API endpoint for the frontend
- Supports legal Q&A with Indian law expertise

## Files

- **gemini.js** - Main API handler (Vercel serverless function)

## How It Works

1. Frontend sends a POST request to `/api/gemini` with:
   ```json
   {
     "userMessage": "Your question here",
     "chatHistory": [...],
     "language": "english",
     "selectedState": "Delhi"
   }
   ```

2. Backend calls HuggingFace's LLaMA 2 model via Inference API

3. Response is returned as JSON to the frontend

## Deployment to Vercel

The `vercel.json` file at the root automatically configures Vercel to:
- Run this function when `/api/gemini` is called
- Inject the `HUGGINGFACE_API_TOKEN` environment variable
- Handle CORS properly

## Local Testing

```bash
# Set your HuggingFace token
export HUGGINGFACE_API_TOKEN=hf_...

# Start dev server (Vite automatically proxies /api to local server)
npm run dev

# Test the endpoint
curl -X POST http://localhost:5173/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"userMessage":"What is IPC?","chatHistory":[],"language":"english","selectedState":""}'
```

## Getting HuggingFace Token

1. Go to [HuggingFace.co](https://huggingface.co)
2. Sign up (free)
3. Go to **Settings** → **Access Tokens**
4. Click **"New token"**
5. Copy the token (starts with `hf_...`)

## Security Notes

- API token is stored in Vercel environment variables (not in code)
- Frontend never sees the token
- Backend validates and sanitizes all input
- CORS is configured to prevent misuse

## Model Used

**meta-llama/Llama-2-7b-chat-hf**
- Free to use via HuggingFace Inference API
- Quality open-source model
- ~7 billion parameters
- Optimized for chat/instruction-following

## Cost

**Completely free!** HuggingFace provides free API access to community models with no quota limits (fair use applies).

