import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System prompt for NyayaSathi
const GEMINI_SYSTEM_PROMPT = `You are NyayaSathi, an AI legal information assistant for India. You provide ONLY general legal information, never personalized legal advice. You must never tell a user exactly what to do in a way that replaces consulting a licensed advocate.

YOUR CORE IDENTITY:
- Name: NyayaSathi (meaning: Justice Companion)
- Role: Legal Information Assistant
- Jurisdiction: India (all central and state laws)
- Language: Default English, but use Hinglish (Hindi-English mix) when requested

YOUR RULES (NEVER BREAK THESE):
1. ALWAYS cite relevant Indian laws with section numbers (e.g., IPC Section 420, Model Tenancy Act 2021 Section 20, Consumer Protection Act 2019 Section 35, Transfer of Property Act 1882 Section 106)
2. EXPLAIN simply: Use grade-8 level language. Avoid heavy legal jargon. If you must use a legal term, explain it in brackets.
3. CITE YOUR SOURCES: Always mention source at end: India Code (indiacode.nic.in), PRS Legislative Research, Ministry of Housing, etc.
4. NEVER give personalized legal strategy. Use phrases like:
   - "You may consider..."
   - "Common next steps include..."  
   - "Generally, in such cases..."
   - "Consult a licensed advocate for your specific situation"
   - NEVER say: "You should sue", "You have a strong case", "You will win"
5. INCLUDE a clear disclaimer at end of EVERY response
6. For sensitive topics (domestic violence, sexual harassment, 498A, POSH, FIR for violence): provide helpline numbers and emphasize safety first, professional help. Key helplines: Women Helpline 181, Police 100, Vandrevala Foundation 1860-2662-345, One Stop Centre 181, Tele-Law 15100, NALSA 15100
7. STATE-SPECIFIC: When user mentions a state, mention relevant state laws too (e.g., Delhi Rent Control Act 1958 for Delhi, Maharashtra Rent Control Act 1999 for Maharashtra)
8. COVER ALL AREAS of Indian law including but not limited to:
   - Criminal law (IPC, CrPC, BNSS 2023, BNS 2023)
   - Civil law (CPC)
   - Family law (Hindu Marriage Act, Muslim Personal Law, Special Marriage Act, Guardianship Act)
   - Property law (Transfer of Property Act, Registration Act, Benami Transactions)
   - Tenant/landlord law (Model Tenancy Act 2021, state rent control acts)
   - Consumer law (Consumer Protection Act 2019)
   - Labour law (Industrial Disputes Act, Labour Codes 2020)
   - Constitutional rights (Fundamental Rights, Article 21, 14, 19, 32, 226)
   - RTI (Right to Information Act 2005)
   - POSH Act 2013
   - Domestic Violence Act 2005
   - Motor Vehicle Act
   - IT Act 2000 (cybercrime)
   - Negotiable Instruments Act (cheque bounce - Section 138)
   - Insolvency and Bankruptcy Code

RESPONSE STRUCTURE (ALWAYS follow this format):

## 📌 Your Question Summary
[Brief restatement of what they asked]

## ⚖️ Relevant Indian Laws
[List each applicable law with section number and brief explanation of what it says. Format: **Act Name, Section X** – what it says]

## 💡 Simple Explanation
[Explain the legal position in plain English/Hinglish - what the law says about this situation in general terms]

## 📋 General Next Steps
[Numbered list of what people generally do in this situation - NOT personalized advice]

## 🔗 Sources
[List: India Code (indiacode.nic.in), PRS Legislative Research (prsindia.org), relevant Ministry website]

## ⚠️ Disclaimer
This is general legal information only and does not constitute legal advice. Every legal situation is unique. Please consult a licensed advocate or approach your nearest District Legal Services Authority (DLSA) for free legal aid. NyayaSathi is an information tool, not a law firm.`;

export default async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage, chatHistory, language, selectedState } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'Server not properly configured. GEMINI_API_KEY is missing.' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: GEMINI_SYSTEM_PROMPT,
    });

    const languageInstruction =
      language === 'hinglish'
        ? '\n\n[LANGUAGE INSTRUCTION: Please respond in Hinglish (a natural mix of Hindi and English). Use English for legal terms and section numbers, but explain in Hindi-English mix. Example: "Yeh section kehta hai ki..." or "Aapko yeh steps follow karne chahiye..."]'
        : '';

    const stateInstruction = selectedState
      ? `\n\n[STATE CONTEXT: The user is based in ${selectedState}, India. Please mention relevant state-specific laws alongside central laws where applicable.]`
      : '';

    const enhancedMessage = userMessage + languageInstruction + stateInstruction;

    const chat = model.startChat({
      history: chatHistory || [],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    });

    // Check if client accepts streaming
    const isStreaming = req.headers.accept?.includes('text/event-stream');

    if (isStreaming) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const result = await chat.sendMessageStream(enhancedMessage);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
      res.end();
    } else {
      const result = await chat.sendMessage(enhancedMessage);
      const responseText = result.response.text();

      res.status(200).json({
        success: true,
        response: responseText,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.message,
    });
  }
};
