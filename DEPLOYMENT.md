# Deployment Guide for NyayaSathi

NyayaSathi is deployed using a serverless architecture with Vercel. This guide walks you through deploying both the frontend and backend.

## Prerequisites

1. A free [Vercel](https://vercel.com) account
2. A free [Google Gemini API key](https://aistudio.google.com/app/apikey)
3. Git installed on your machine
4. A GitHub account (optional but recommended)

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

## Step 2: Deploy to Vercel

### Option A: Using GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account

3. Click "Add New..." → "Project"

4. Select your `nyayasathi` repository

5. In the "Environment Variables" section, add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Paste your API key from Step 1

6. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and add `GEMINI_API_KEY` when asked for environment variables

4. After deployment, go to your project settings on Vercel and add the `GEMINI_API_KEY`

## Step 3: Update Frontend Configuration

After deployment, update your frontend to use the deployed backend:

1. In `src/gemini.ts`, update the `getBackendUrl()` function to use your Vercel URL:
   ```typescript
   const getBackendUrl = () => {
     if (import.meta.env.PROD) {
       return 'https://your-project.vercel.app';
     }
     return 'http://localhost:5173';
   };
   ```

2. Redeploy to Vercel

## Step 4: Local Development

To test locally:

1. Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The app will be available at `http://localhost:5173`
4. Backend API calls will be proxied to the local server

## Important Notes

- **API Key Security**: Your Gemini API key is stored as a Vercel environment variable and is never exposed to the client
- **Rate Limits**: Google's free tier has rate limits. Monitor your usage in [Google AI Studio](https://aistudio.google.com/app/apikey)
- **CORS**: The backend API is configured to accept requests from any origin (`Access-Control-Allow-Origin: *`)
- **Streaming**: The backend supports streaming responses for better UX (real-time chunks)

## Troubleshooting

### "Backend service is unavailable"
- Check that your Vercel deployment is running
- Verify `GEMINI_API_KEY` is set in Vercel environment variables
- Check Vercel logs: `vercel logs`

### "Invalid API Key"
- Verify the key is correct and starts with `AIza...`
- Check the key hasn't been regenerated/revoked in Google AI Studio

### CORS Errors
- The backend should handle CORS automatically
- If still getting CORS errors, check that requests are going to the correct backend URL

## Support

For issues, check:
- Vercel Docs: https://vercel.com/docs
- Google Gemini API Docs: https://ai.google.dev/docs
- GitHub Issues in this repository
