import type { Language } from './types';

// Backend API URL - uses Vite environment variable or defaults based on environment
const getBackendUrl = () => {
  // In production, use the deployed backend
  if (import.meta.env.PROD) {
    // This should be set in your build or deployment
    return import.meta.env.VITE_BACKEND_URL || window.location.origin;
  }
  // In development, use localhost
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
};

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function sendMessageToGemini(
  userMessage: string,
  history: GeminiMessage[],
  language: 'english' | 'hinglish',
  selectedState: string,
  onChunk?: (text: string) => void
): Promise<string> {
  const backendUrl = getBackendUrl();
  const apiUrl = `${backendUrl}/api/gemini`;

  try {
    // If streaming is supported and callback provided
    if (onChunk && typeof EventSource !== 'undefined') {
      return await streamFromBackend(apiUrl, userMessage, history, language, selectedState, onChunk);
    }

    // Fallback to regular POST request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        chatHistory: history,
        language,
        selectedState,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Backend service is unavailable. Please check your internet connection or contact support.');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

async function streamFromBackend(
  apiUrl: string,
  userMessage: string,
  history: GeminiMessage[],
  language: 'english' | 'hinglish',
  selectedState: string,
  onChunk: (text: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload = {
      userMessage,
      chatHistory: history,
      language,
      selectedState,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        let fullText = '';
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.text) {
                fullText += data.text;
                onChunk(data.text);
              }
              if (data.done) {
                resolve(data.fullText || fullText);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
        resolve(fullText);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
