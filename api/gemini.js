// Together AI API backend for NyayaSathi
// Free tier: https://www.together.ai
// Instant setup, no deployment issues!

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

    // Check Together API key
    const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
    if (!TOGETHER_API_KEY) {
      console.error('TOGETHER_API_KEY environment variable is not set');
      return res.status(500).json({ 
        error: 'Server misconfigured',
        message: 'TOGETHER_API_KEY is missing. Please set it in Vercel environment variables.'
      });
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
    let messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ];
    
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      for (const msg of chatHistory) {
        if (msg.role === 'user') {
          messages.push({
            role: 'user',
            content: msg.parts?.[0]?.text || msg.content || ''
          });
        } else if (msg.role === 'model' || msg.role === 'assistant') {
          messages.push({
            role: 'assistant',
            content: msg.parts?.[0]?.text || msg.content || ''
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: finalMessage
    });

    console.log('Sending request to Together AI...');

    // Call Together AI API
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-2-70b-chat-hf',
        messages: messages,
        max_tokens: 1024,
        temperature: 0.4,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Together AI Error:', response.status, errorData);
      
      if (response.status === 401) {
        return res.status(500).json({
          error: 'API Authentication Failed',
          message: 'TOGETHER_API_KEY is invalid. Please update it in Vercel Environment Variables.'
        });
      }

      return res.status(response.status).json({
        error: 'Failed to get response from Together AI',
        details: errorData.error?.message || response.statusText,
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Together AI');
    }

    const responseMessage = data.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      response: responseMessage,
    });

  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : error);
    
    const errorDetails = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    res.status(500).json({
      error: 'Failed to process your request',
      details: errorDetails,
    });
  }
};
