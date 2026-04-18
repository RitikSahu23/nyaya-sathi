FROM ollama/ollama:latest

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create startup script that pulls model and starts server
RUN mkdir -p /app
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

WORKDIR /app

# Expose Ollama API port
EXPOSE 11434

# Start server with model pulling
ENTRYPOINT ["/app/entrypoint.sh"]

