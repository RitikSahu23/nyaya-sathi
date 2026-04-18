#!/bin/bash

# Start Ollama daemon in background
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
sleep 5

# Try to pull model with retries
echo "Pulling mistral model..."
for i in {1..3}; do
    if ollama pull mistral; then
        echo "Model pulled successfully"
        break
    else
        echo "Attempt $i failed, retrying..."
        sleep 5
    fi
done

# Keep the daemon running in foreground
wait $OLLAMA_PID
