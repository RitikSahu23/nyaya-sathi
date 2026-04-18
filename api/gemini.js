// Ollama API backend for NyayaSathi
// For local development: Install Ollama, run: ollama pull mistral
// Then: ollama serve (keeps running in background)

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_PULL_URL = process.env.OLLAMA_API_URL?.replace('/api/generate', '/api/pull') || 'http://localhost:11434/api/pull';

// Try to pull mistral model on startup
async function ensureModelLoaded() {
  try {
    console.log('Checking if mistral model is available...');
    // Give Ollama time to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pullResponse = await fetch(OLLAMA_PULL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mistral' }),
      timeout: 5000,
    }).catch(() => null);
    
    if (pullResponse?.ok) {
      console.log('Mistral model loaded successfully');
    }
  } catch (err) {
    console.log('Model loading in background...', err.message);
  }
}

// Start model loading (don't wait for it)
ensureModelLoaded();

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

    // Build enhanced message with context
    const languageHint = language === 'hinglish' 
      ? '\n\n[Please respond in Hinglish - Hindi-English mix. Use English for legal terms, explain in Hindi-English.]'
      : '';

    const stateHint = selectedState 
      ? `\n\n[User is from ${selectedState}, India. Mention state-specific laws alongside central laws.]`
      : '';

    const finalMessage = userMessage + languageHint + stateHint;

    // Build conversation history
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
    
    // Use the pre-defined OLLAMA_URL constant
    try {
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
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama response error:', response.status, errorText.substring(0, 200));
        
        // If model not found, give helpful message
        if (response.status === 404 || errorText.includes('not found')) {
          throw new Error('Mistral model not found. On first deployment, the model may need to load. Please wait 5-10 minutes and try again.');
        }
        
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('No response from Ollama');
      }

      return res.status(200).json({
        success: true,
        response: data.response.trim(),
      });

    } catch (ollamaError) {
      console.error('Ollama Error:', ollamaError.message);
      
      // Fallback: Return demo response
      console.log('Ollama not available. Using demo mode.');
      
      const demoResponse = `## Your Question: ${userMessage.substring(0, 50)}...

## Relevant Indian Laws
- Indian Penal Code (IPC)
- Consumer Protection Act, 2019
- Constitution of India
- State-specific laws (${selectedState || 'Your State'})

## Simple Explanation
This is a demo response. To get real AI responses:

**For Development:** Install and run Ollama locally
- Download: https://ollama.ai
- Run: \`ollama pull mistral\` then \`ollama serve\`
- The app will automatically connect to your local Ollama

**General Legal Info:** Consult DLSA or Bar Council

## Disclaimer
This is general legal information only - not legal advice. For proper legal guidance, consult a licensed advocate or your nearest District Legal Services Authority (DLSA).`;

      return res.status(200).json({
        success: true,
        response: demoResponse,
      });
    }

  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : error);
    
    res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
