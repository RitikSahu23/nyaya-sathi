# Deploy to Production with Railway.app + Vercel

This guide shows how to deploy your app to production so anyone can access it online.

## Architecture
```
Friend's Browser
    ↓
Vercel (Frontend React App)
    ↓
Vercel API Functions
    ↓
Railway.app Ollama Server
    ↓
Mistral AI Model
```

---

## Part 1: Deploy Ollama Backend to Railway.app

### Step 1: Create Railway Account
1. Go to **https://railway.app**
2. Click **"Start Project"**
3. Sign up with GitHub (easiest)

### Step 2: Deploy from GitHub
1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Choose **RitikSahu23/nyaya-sathi** repository
4. Click **"Deploy"**

Railway will automatically detect the `Dockerfile` and start deploying!

### Step 3: Wait for Deployment
- Railway will build the Docker image
- Download the mistral model (takes ~5-10 minutes first time)
- You'll see: `Service is running`

### Step 4: Get Your Ollama URL
1. In Railway dashboard, click your project
2. Go to **"Settings"** tab
3. Find **"Domain"** - copy this URL
4. It looks like: `https://nyaya-sathi-ollama-prod.railway.app`

**Your Ollama server is now LIVE!** ✅

---

## Part 2: Update Vercel with Ollama URL

### Step 1: Add Environment Variable to Vercel
1. Go to **Vercel Dashboard** → `nyaya-sathi` → **Settings** → **Environment Variables**
2. Create new variable:
   - **Name:** `OLLAMA_API_URL`
   - **Value:** `https://your-railway-url.railway.app/api/generate` (from Step 4 above)
   - **Environments:** Check "Production"
3. Click **"Save"**

### Step 2: Redeploy on Vercel
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Wait 2-3 minutes

### Step 3: Test
1. Visit your Vercel URL: `https://nyaya-sathi-xxx.vercel.app`
2. Try asking a legal question
3. It should work! 🎉

---

## Share with Your Friend

Now you can share the Vercel link with your friend:
```
https://nyaya-sathi-xxx.vercel.app
```

They just open it in their browser - no installation needed! Everything works from the cloud.

---

## Troubleshooting

### "Error: Cannot reach Ollama"
- Check that Railway deployment is still running
- Go to Railway dashboard → check service status
- May need to restart if it crashed

### "504 Gateway Timeout"
- Ollama model is still loading (first request takes time)
- Wait 30 seconds and try again

### "Connection refused"
- Make sure `OLLAMA_API_URL` is set correctly in Vercel
- Verify the Railway URL is public and accessible

### Check Logs
**Railway Logs:**
1. Railway dashboard → Click project
2. Click **"Logs"** tab
3. See what's happening

**Vercel Logs:**
1. Vercel dashboard → Deployments
2. Click latest deployment
3. See **"Function logs"** at bottom

---

## Cost

- **Railway:** Free tier includes $5/month credit (enough for testing)
- **Vercel:** Free tier (includes serverless functions)
- **Total:** Completely free!

If you exceed Railway free tier, it's ~$10/month.

---

## Local Testing (Still Works)

You can still run locally:
```bash
ollama serve
```

And leave `OLLAMA_API_URL` pointing to localhost. App automatically uses local Ollama when available!
