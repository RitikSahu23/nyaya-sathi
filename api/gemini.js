// HuggingFace Inference API backend for NyayaSathi

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

## Sources
[Reference sources]

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
    // Check API token
    const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
    if (!HF_TOKEN) {
      console.error('HUGGINGFACE_API_TOKEN environment variable is not set');
      return res.status(500).json({ 
        error: 'Server misconfigured',
        message: 'HUGGINGFACE_API_TOKEN is missing. Please set it in Vercel environment variables.'
      });
    }

    // Get request body
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

    // Build conversation history for HuggingFace
    let messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: SYSTEM_PROMPT
    });

    // Add chat history
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

    // Call HuggingFace Inference API
    // Using mistral-7b-instruct-v0.1 (faster, stable model)
    console.log('Sending request to HuggingFace with token:', HF_TOKEN ? 'SET' : 'NOT SET');
    
    // Format messages for HuggingFace (convert to text format)
    let conversationText = '';
    for (const msg of messages) {
      if (msg.role === 'system') {
        conversationText += `System: ${msg.content}\n\n`;
      } else if (msg.role === 'user') {
        conversationText += `User: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        conversationText += `Assistant: ${msg.content}\n\n`;
      }
    }
    conversationText += 'Assistant: ';
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: conversationText,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.4,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    // Get response text for logging
    const responseText = await response.text();
    console.log('HuggingFace Response Status:', response.status);
    console.log('HuggingFace Response Body:', responseText.substring(0, 200));

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { raw: responseText };
      }
      
      console.error('HuggingFace API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      // Check if token is missing
      if (response.status === 401) {
        return res.status(500).json({
          error: 'API Authentication Failed',
          message: 'HUGGINGFACE_API_TOKEN is invalid or expired. Please update it in Vercel Environment Variables.'
        });
      }
      
      // Check if model is loading
      if (response.status === 503) {
        return res.status(503).json({
          error: 'Model Loading',
          message: 'The AI model is currently loading. Please try again in 30 seconds.'
        });
      }
      
      return res.status(response.status).json({
        error: 'Failed to get response from HuggingFace API',
        status: response.status,
        details: errorData.error?.message || errorData.error || response.statusText,
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse HuggingFace response:', e);
      throw new Error('Invalid JSON response from HuggingFace API');
    }
    
    // HuggingFace Inference API returns an array
    if (!Array.isArray(data) || !data[0]) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from HuggingFace API: expected array');
    }

    const responseMessage = data[0].generated_text || data[0].text;

    res.status(200).json({
      success: true,
      response: responseMessage,
    });

  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : error);
    console.error('Full error:', error);
    
    const errorDetails = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    res.status(500).json({
      error: 'Failed to process your request',
      details: errorDetails,
    });
  }
};
