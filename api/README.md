# NyayaSathi - Backend Setup

This directory contains the serverless backend for NyayaSathi that:
- Hides your Gemini API key from users
- Provides a clean API endpoint for the frontend
- Supports streaming responses for real-time chat

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

2. Backend uses the `GEMINI_API_KEY` environment variable to call Google's Gemini API

3. Response is streamed back to the frontend in real-time

## Deployment to Vercel

The `vercel.json` file at the root automatically configures Vercel to:
- Run this function when `/api/gemini` is called
- Inject the `GEMINI_API_KEY` environment variable
- Handle CORS properly

## Local Testing

```bash
# Set your API key
export GEMINI_API_KEY=AIzaSy...

# Start dev server (Vite automatically proxies /api to local server)
npm run dev

# Test the endpoint
curl -X POST http://localhost:5173/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"userMessage":"What is IPC?","chatHistory":[],"language":"english","selectedState":""}'
```

## Security Notes

- API key is stored in Vercel environment variables (not in code)
- Frontend never sees the API key
- Backend validates and sanitizes all input
- CORS is configured to prevent misuse
