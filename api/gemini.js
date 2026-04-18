// Ollama API backend for NyayaSathi
// Local development: Install Ollama from https://ollama.ai
// Run: ollama pull mistral && ollama serve

const SYSTEM_PROMPT = `You are NyayaSathi, an AI legal information assistant for India. You provide ONLY general legal information, never personalized legal advice.

YOUR CORE IDENTITY:
- Name: NyayaSathi (Justice Companion)
- Role: Legal Information Assistant
- Jurisdiction: India (all central and state laws)

YOUR RULES:
1. ALWAYS cite relevant Indian laws with section numbers (IPC, Consumer Protection Act, RTI, MTA 2021, etc.)
2. EXPLAIN simply: Grade-8 level language. Avoid heavy jargon.
3. NEVER give personalized legal strategy. Use "You may consider...", "Consult a licensed advocate..."
4. INCLUDE disclaimer at end of EVERY response
5. For sensitive topics: provide helplines (Women Helpline 181, Police 100, NALSA 15100, Tele-Law 15100)
6. STATE-SPECIFIC: Mention relevant state laws alongside central laws
7. Cover ALL AREAS of Indian law - Criminal, Civil, Family, Property, Tenant/Landlord, Consumer, Labour, Constitutional, RTI, POSH, DV Act, IT Act, etc.

RESPONSE FORMAT:
## Your Question Summary
[Brief restatement]

## Relevant Indian Laws  
[List laws with section numbers]

## Simple Explanation
[Plain English explanation of the law]

## General Next Steps
[Numbered list of what people generally do]

## Disclaimer
This is general legal information only - not legal advice. Please consult a licensed advocate or approach your nearest District Legal Services Authority (DLSA) for free legal aid.`;

export default async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { userMessage, chatHistory, language, selectedState } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage is required and must be a string' });
    }

    // Get Ollama URL (default to localhost)
    const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

    // Build enhanced message with context
    const languageHint = language === 'hinglish' 
      ? '\n\n[Please respond in Hinglish - Hindi-English mix. Use English for legal terms, explain in Hindi-English.]'
      : '';

    const stateHint = selectedState 
      ? `\n\n[User is from ${selectedState}, India. Mention state-specific laws alongside central laws.]`
      : '';

    const finalMessage = userMessage + languageHint + stateHint;

    // Build conversation history
    let messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ];
    
    // Build prompt with conversation history
    let conversationText = SYSTEM_PROMPT + '\n\n---\n\n';
    
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      for (const msg of chatHistory) {
        const role = msg.role === 'model' ? 'Assistant' : 'User';
        const content = msg.parts?.[0]?.text || msg.content || '';
        if (content) {
          conversationText += `${role}: ${content}\n\n`;
        }
      }
    }

    conversationText += `User: ${finalMessage}\n\nAssistant: `;

    console.log('Sending request to Ollama...');
    console.log('OLLAMA_URL:', OLLAMA_URL);
    console.log('Request body:', JSON.stringify({
      model: 'mistral',
      prompt: conversationText.substring(0, 100) + '...',
      stream: false,
      temperature: 0.4,
    }));

    // Call Ollama API
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: conversationText,
        stream: false,
        temperature: 0.4,
      }),
    }).catch(err => {
      console.error('Fetch error:', err);
      throw err;
    });

    console.log('Ollama response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', response.status, errorText.substring(0, 200));
      
      return res.status(response.status).json({
        error: 'Failed to connect to Ollama',
        message: 'Make sure Ollama is running locally: ollama serve',
        details: errorText.substring(0, 500),
      });
    }

    const data = await response.json();
    
    if (!data.response) {
      console.error('Invalid response format:', data);
      throw new Error('No response from Ollama');
    }

    const responseMessage = data.response.trim();

    res.status(200).json({
      success: true,
      response: responseMessage,
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('===== API ERROR =====');
    console.error('Message:', errorMsg);
    console.error('Stack:', errorStack);
    console.error('Type:', typeof error);
    console.error('====================');
    
    res.status(500).json({
      error: 'Failed to process your request',
      details: errorMsg,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
  }
};
