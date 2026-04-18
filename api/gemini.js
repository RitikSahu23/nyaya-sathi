import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_SYSTEM_PROMPT = `You are NyayaSathi, an AI legal information assistant for India. You provide ONLY general legal information, never personalized legal advice.

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
    // Check API key first
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return res.status(500).json({ 
        error: 'Server misconfigured',
        message: 'GEMINI_API_KEY is missing. Please set it in Vercel environment variables.'
      });
    }

    // Get request body
    const { userMessage, chatHistory, language, selectedState } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage is required and must be a string' });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: GEMINI_SYSTEM_PROMPT,
    });

    // Build enhanced message
    const languageHint = language === 'hinglish' 
      ? '\n\n[Please respond in Hinglish - Hindi-English mix. Use English for legal terms, explain in Hindi-English.]'
      : '';

    const stateHint = selectedState 
      ? `\n\n[User is from ${selectedState}, India. Mention state-specific laws alongside central laws.]`
      : '';

    const finalMessage = userMessage + languageHint + stateHint;

    // Start chat
    const chat = model.startChat({
      history: Array.isArray(chatHistory) ? chatHistory : [],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    });

    // Send message
    const result = await chat.sendMessage(finalMessage);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      response: responseText,
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    const errorDetails = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    res.status(500).json({
      error: 'Failed to get response from AI',
      details: errorDetails,
    });
  }
};
