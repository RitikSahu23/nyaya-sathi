# Ollama Setup - Run NyayaSathi AI Locally

Ollama lets you run AI models completely locally, free, with no API issues.

## Installation

### Windows/Mac
1. Download: https://ollama.ai
2. Install and launch

### Linux
```bash
curl https://ollama.ai/install.sh | sh
```

## Setup Steps

### 1. Download the Model
```bash
ollama pull mistral
```

### 2. Start Ollama Server
```bash
ollama serve
```

You should see:
```
Listening on 127.0.0.1:11434
```

Keep this terminal running in the background.

### 3. Test Locally

Start the dev server:
```bash
npm run dev
```

Open http://localhost:5173 and start chatting! 

The app will automatically connect to your local Ollama instance running on `localhost:11434`.

## How It Works

- **No API costs** - Completely free
- **Offline** - Works without internet
- **No rate limits** - Use as much as you want
- **Fast responses** - Runs on your computer

## Troubleshooting

### "Failed to load resource"
Make sure Ollama is running:
```bash
# Check if service is running
ollama serve
```

### "Connection refused"
Ollama server isn't running. Run `ollama serve` first.

### Want Different Model?
```bash
# Download another model
ollama pull neural-chat
# Or
ollama pull llama2
```

Then restart the server.

## Production Deployment

For Vercel (when internet is required):
- Switch back to HuggingFace by uncommenting the HF code
- Or use Together AI (free tier with good models)
- Or use Replicate API

## Environment Variable (Optional)

You can specify a custom Ollama URL:
```bash
export OLLAMA_API_URL=http://your-ollama-server:11434/api/generate
```

Default: `http://localhost:11434/api/generate`
