import {
  formatReferenceContext,
  formatReferenceSources,
  retrieveLegalReferences,
} from './legal-references.js';

const SYSTEM_PROMPT = `You are NyayaSathi, an AI legal information assistant for India. You provide only general legal information, never personalized legal advice.

YOUR CORE IDENTITY:
- Name: NyayaSathi (Justice Companion)
- Role: Legal Information Assistant
- Jurisdiction: India (all central and state laws)

YOUR RULES:
1. Answer the user's legal question directly in the first sentence.
2. Explain simply using plain language.
3. Mention only laws that are genuinely relevant to the facts.
4. If you are unsure about an exact section number, do not invent one. Name the law generally and say the exact section should be verified.
5. Never describe what you as an AI/assistant will do.
6. Never ask the user to restate the scenario when enough facts are already given.
7. Never give personalized legal strategy or guaranteed outcomes. Use general phrases like "Generally..." or "In such cases..."
8. For each law you mention, explain in one simple sentence what it means and why it matters here.
9. After explaining the law, briefly explain how it applies to the user's scenario in general terms.
10. Include a disclaimer at the end of every response.
11. If trusted reference context is provided, prioritize it over model memory and do not cite sections that conflict with it.
12. If no trusted reference context clearly identifies an exact section, say the section should be verified instead of guessing.

RESPONSE FORMAT:
## Your Question Summary
[Brief restatement]

## Relevant Indian Laws
- **Act / section**: simple explanation of what it means and why it matters

## Simple Explanation
[Direct answer first, then plain-language explanation]

## How This Law Applies Here
[Brief application to the scenario]

## General Suggestion / Legal View
[Short general suggestion or legal view, not personalized advice]

## Sources to Verify
[List trusted official sources used, if any]

## Disclaimer
This is general legal information only, not legal advice. Please consult a licensed advocate or approach your nearest District Legal Services Authority (DLSA) for free legal aid.`;

const OLLAMA_SYSTEM_PROMPT = `You are NyayaSathi, an Indian legal information assistant.

Rules:
- Answer directly in the first sentence.
- Do not say what the assistant will do.
- Use only relevant Indian laws.
- If unsure of a section number, do not invent one.
- If trusted reference context is provided, prefer it.
- Explain simply.

Use this structure:
## Your Question Summary
## Relevant Indian Laws
## Simple Explanation
## How This Law Applies Here
## General Suggestion / Legal View
## Sources to Verify
## Disclaimer`;

function buildUserMessage({ userMessage, language, selectedState }) {
  const languageHint =
    language === 'hinglish'
      ? '\n\nPlease respond in Hinglish. Use English for legal terms and explain in a Hindi-English mix.'
      : '';

  const stateHint = selectedState
    ? `\n\nThe user is from ${selectedState}, India. Mention relevant state-specific laws along with central laws when applicable.`
    : '';

  return `${userMessage}${languageHint}${stateHint}`;
}

function buildContents({ chatHistory, finalMessage }) {
  const contents = [];

  if (Array.isArray(chatHistory)) {
    for (const msg of chatHistory) {
      const text = msg?.parts?.[0]?.text || msg?.content || '';
      if (!text) continue;

      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: finalMessage }],
  });

  return contents;
}

function buildOllamaMessages({ chatHistory, finalMessage, references }) {
  const messages = [
    {
      role: 'system',
      content: OLLAMA_SYSTEM_PROMPT,
    },
  ];

  if (references?.length) {
    messages.push({
      role: 'system',
      content: `Trusted Indian legal reference context:\n${formatReferenceContext(references)}`,
    });
  }

  if (Array.isArray(chatHistory)) {
    for (const msg of chatHistory) {
      const text = msg?.parts?.[0]?.text || msg?.content || '';
      if (!text) continue;

      messages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: text,
      });
    }
  }

  messages.push({
    role: 'user',
    content: finalMessage,
  });

  return messages;
}

function extractResponseText(data) {
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned no text content');
  }

  return text;
}

function dedupeRepeatedParagraphs(text) {
  if (!text) return text;

  const lines = text.split('\n');
  const result = [];
  const seen = new Set();

  for (const line of lines) {
    const normalized = line.trim().replace(/\s+/g, ' ').toLowerCase();
    if (normalized && seen.has(normalized)) {
      continue;
    }

    result.push(line);
    if (normalized) {
      seen.add(normalized);
    }
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function looksLikeMetaResponse(text) {
  if (!text) return false;

  const normalized = text.toLowerCase();

  return [
    'i can provide',
    'the assistant will provide',
    'briefly summarize the incident',
    'include the relevant laws',
    'core identity:',
    'response format:',
    'your rules:',
    'rules:',
  ].some((pattern) => normalized.includes(pattern));
}

function stripPromptLeakage(text) {
  if (!text) return text;

  let cleaned = text.trim();
  const leakageMarkers = [
    /your core identity:[\s\S]*/i,
    /core identity:[\s\S]*/i,
    /response format:[\s\S]*/i,
    /your rules:[\s\S]*/i,
  ];

  for (const marker of leakageMarkers) {
    if (marker.test(cleaned)) {
      cleaned = cleaned.replace(marker, '').trim();
    }
  }

  return cleaned;
}

function hasStructuredSections(text) {
  if (!text) return false;

  const normalized = text.toLowerCase();
  return (
    normalized.includes('question summary') &&
    normalized.includes('relevant indian laws') &&
    normalized.includes('simple explanation') &&
    normalized.includes('disclaimer')
  );
}

function formatOllamaResponse(text) {
  const cleaned = dedupeRepeatedParagraphs(stripPromptLeakage(text)?.trim() || '');

  if (!cleaned) return cleaned;
  if (hasStructuredSections(cleaned)) return cleaned;

  const firstParagraph = cleaned.split(/\n\s*\n/)[0]?.trim() || cleaned;
  const directAnswer = firstParagraph.split(/(?<=[.!?])\s/)[0]?.trim() || firstParagraph;

  return [
    '## Your Question Summary',
    'The user wants to know the general legal position under Indian law for this situation.',
    '',
    '## Relevant Indian Laws',
    '- Please verify the exact statute or section with a lawyer or official source if the model does not name it clearly.',
    '',
    '## Simple Explanation',
    directAnswer,
    cleaned,
    '',
    '## How This Law Applies Here',
    'The legal outcome usually depends on the exact facts, documents, and evidence available.',
    '',
    '## General Suggestion / Legal View',
    'A stronger legal position usually depends on written proof, messages, contracts, receipts, screenshots, notices, or witnesses.',
    '',
    '## Disclaimer',
    'This is general legal information only, not legal advice. Please consult a licensed advocate or approach your nearest District Legal Services Authority (DLSA) for free legal aid.',
  ].join('\n');
}

function appendSourcesSection(responseText, references) {
  if (!references?.length) return responseText;
  if (responseText.toLowerCase().includes('## sources to verify')) return responseText;

  return `${responseText}\n\n${formatReferenceSources(references)}`;
}

function getOllamaChatUrl(ollamaUrl) {
  if (!ollamaUrl) {
    return 'http://127.0.0.1:11434/api/chat';
  }

  if (ollamaUrl.endsWith('/api/generate')) {
    return `${ollamaUrl.slice(0, -'/generate'.length)}/chat`;
  }

  if (ollamaUrl.endsWith('/api/chat')) {
    return ollamaUrl;
  }

  return ollamaUrl;
}

async function callOllama({ ollamaUrl, ollamaModel, messages }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch(getOllamaChatUrl(ollamaUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: ollamaModel,
        messages,
        stream: false,
        temperature: 0.2,
      }),
    });

    const rawText = await response.text();
    let data = {};

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { rawText };
      }
    }

    return { response, rawText, data };
  } finally {
    clearTimeout(timeout);
  }
}

async function generateOllamaResponse({ finalMessage, chatHistory, ollamaUrl, ollamaModel, references }) {
  const messages = buildOllamaMessages({ chatHistory, finalMessage, references });

  try {
    const { response, rawText, data } = await callOllama({
      ollamaUrl,
      ollamaModel,
      messages,
    });

    if (!response.ok) {
      return {
        status: response.status,
        body: {
          error: 'Failed to generate response from Ollama',
          details:
            data?.error ||
            data?.rawText ||
            rawText ||
            `Ollama request failed with HTTP ${response.status}`,
        },
      };
    }

    const responseText = stripPromptLeakage(
      data?.message?.content?.trim() || data?.response?.trim(),
    );

    if (!responseText) {
      return {
        status: 500,
        body: {
          error: 'Invalid Ollama response',
          details: 'Ollama returned no response text.',
        },
      };
    }

    if (looksLikeMetaResponse(responseText)) {
      return {
        status: 500,
        body: {
          error: 'Ollama returned an unusable response',
          details: 'The local model did not return a usable direct legal answer. For broad legal Q&A, use a stronger Ollama model like mistral or llama3.1:8b.',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        response: appendSourcesSection(formatOllamaResponse(responseText), references),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: 500,
      body: {
        error: 'Failed to connect to Ollama',
        details: message,
        hint: `Make sure Ollama is running and the model "${ollamaModel}" is available.`,
      },
    };
  }
}

async function generateGoogleResponse({ finalMessage, chatHistory, apiKey, model, references }) {
  const contents = buildContents({ chatHistory, finalMessage });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const systemInstructionText = references?.length
    ? `${SYSTEM_PROMPT}\n\nTrusted Indian legal reference context:\n${formatReferenceContext(references)}`
    : SYSTEM_PROMPT;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstructionText }],
        },
        contents,
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
        },
      }),
    });

    const rawText = await response.text();
    let data = {};

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { rawText };
      }
    }

    if (!response.ok) {
      const details =
        data?.error?.message ||
        data?.rawText ||
        rawText ||
        `Gemini request failed with HTTP ${response.status}`;

      return {
        status: response.status,
        body: {
          error: 'Failed to generate response from Gemini',
          details,
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        response: appendSourcesSection(extractResponseText(data), references),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: 500,
      body: {
        error: 'Failed to process your request',
        details: message,
      },
    };
  }
}

export async function generateGeminiResponse(payload, options = {}) {
  const { userMessage, chatHistory = [], language = 'english', selectedState = '' } = payload ?? {};

  if (!userMessage || typeof userMessage !== 'string') {
    return {
      status: 400,
      body: { error: 'userMessage is required and must be a string' },
    };
  }

  const apiKey =
    options.apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;
  const ollamaUrl =
    options.ollamaUrl ||
    process.env.OLLAMA_API_URL ||
    'http://127.0.0.1:11434/api/generate';
  const ollamaModel =
    options.ollamaModel ||
    process.env.OLLAMA_MODEL ||
    'qwen2.5:3b';
  
  // Forced to Ollama as per user request to avoid Gemini limitations
  const provider = 'ollama';

  const finalMessage = buildUserMessage({ userMessage, language, selectedState });
  const references = retrieveLegalReferences(userMessage, selectedState);

  return generateOllamaResponse({
    finalMessage,
    chatHistory,
    ollamaUrl,
    ollamaModel,
    references,
  });
}
