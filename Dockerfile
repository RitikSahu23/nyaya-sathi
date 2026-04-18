FROM ollama/ollama:latest

# Expose Ollama API port
EXPOSE 11434

# Set environment for model caching
ENV OLLAMA_HOST=0.0.0.0:11434

# Default command - just start the server
# Model will be pulled on first request
CMD ["ollama", "serve"]

