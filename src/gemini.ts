import type { Language } from './types';

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
  try {
    const response = await fetch('/api/gemini', {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (onChunk) {
      // Call onChunk with the full response
      onChunk(data.response);
    }
    
    return data.response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend. Please check your internet connection.');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}
