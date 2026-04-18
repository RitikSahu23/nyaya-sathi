FROM ollama/ollama:latest

# Expose Ollama API port
EXPOSE 11434

# Download mistral model when container starts
RUN ollama pull mistral

# Start Ollama server
CMD ["ollama", "serve"]
