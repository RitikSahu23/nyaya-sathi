# NyayaSathi - Rate Limit Solutions

## 🚨 You're Getting 429 (Too Many Requests)

This means you've hit **Gemini's free tier rate limit**.

### ⏱️ Gemini Free Tier Limits
- **1-2 requests per minute maximum**
- Limits reset every 60 seconds
- Perfect for: Testing, demos, low-volume use

### ✅ Solutions

#### Option 1: Wait and Try Again (Simplest)
Just wait **60 seconds** and your quota resets automatically.

---

#### Option 2: Use Ollama (Unlimited - Recommended)

If you want **unlimited requests**, use Ollama instead:

```bash
# 1. Download Ollama: https://ollama.com

# 2. Run Ollama in a terminal:
ollama serve

# 3. Create/update .env.local:
OLLAMA_API_URL=http://127.0.0.1:11434
OLLAMA_MODEL=phi3.5:latest
AI_PROVIDER=ollama

# 4. Restart the dev server:
npm run dev
```

**No rate limits!** You control the model running locally.

---

#### Option 3: Upgrade Gemini API (Paid)

For production use:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enable billing on your Google Cloud project
3. Higher rate limits (~60 requests/minute on paid tier)

---

#### Option 4: Use Different Gemini Model (Experiment)

Some models have better rate limits:
```bash
# In .env.local:
GEMINI_MODEL=gemini-1.5-flash-8b
```

---

## 📊 Comparison

| Provider | Cost | Rate Limit | Setup | Quality |
|----------|------|-----------|-------|---------|
| **Gemini Free** | Free | 1-2/min | 5 min ⭐ | Very Good |
| **Gemini Paid** | $0.075/1M tokens | 60/min | 10 min | Excellent |
| **Ollama** | Free | Unlimited | 30 min | Good* |

*Ollama quality depends on your model choice and hardware

---

## 🎯 Recommendation

**For development:** Use **Ollama** (unlimited, no costs)
```bash
ollama pull phi3.5:latest
```

**For production:** Use **Gemini Paid** or **Ollama on server**

---

## Debug: Check Which Provider You're Using

In the browser console, the server logs will show:
```
📤 API Response Status: 200
```

If you see `429`, you hit the rate limit. Just wait 60 seconds!
