import type { QuickScenario, State, DocumentTemplate } from './types';

export const INDIAN_STATES: State[] = [
  { id: 'delhi', name: 'Delhi', available: true },
  { id: 'maharashtra', name: 'Maharashtra', available: true },
  { id: 'karnataka', name: 'Karnataka', available: true },
  { id: 'up', name: 'Uttar Pradesh', available: true },
  { id: 'tn', name: 'Tamil Nadu', available: false },
  { id: 'wb', name: 'West Bengal', available: false },
  { id: 'gujarat', name: 'Gujarat', available: false },
  { id: 'rajasthan', name: 'Rajasthan', available: false },
  { id: 'haryana', name: 'Haryana', available: false },
  { id: 'mp', name: 'Madhya Pradesh', available: false },
];

export const QUICK_SCENARIOS: QuickScenario[] = [
  {
    id: 'security-deposit',
    label: 'Landlord won\'t return security deposit',
    hinglishLabel: 'Landlord security deposit wapas nahi kar raha',
    query: 'My landlord is refusing to return my security deposit after I vacated the property. What are my rights and what can I do?',
    icon: '💰',
    category: 'tenant',
  },
  {
    id: 'rent-agreement',
    label: 'Rent agreement format & clauses (11-month)',
    hinglishLabel: 'Rent agreement format (11 mahine ka)',
    query: 'What should be included in a standard 11-month rent agreement in India? What are the important clauses and legal requirements?',
    icon: '📄',
    category: 'tenant',
  },
  {
    id: 'illegal-eviction',
    label: 'Illegal eviction / notice period',
    hinglishLabel: 'Illegal eviction / notice period ka haq',
    query: 'My landlord is trying to evict me without giving proper notice. What is the legal notice period required and what are my rights against illegal eviction?',
    icon: '🏠',
    category: 'tenant',
  },
  {
    id: 'maintenance',
    label: 'Maintenance issues in rental property',
    hinglishLabel: 'Rental property mein maintenance issues',
    query: 'My landlord is not doing necessary repairs and maintenance in my rented property. Water leakage and electricity issues are not being fixed. What can I do legally?',
    icon: '🔧',
    category: 'tenant',
  },
  {
    id: 'rent-hike',
    label: 'Rent hike dispute',
    hinglishLabel: 'Rent badhane ka vivad',
    query: 'My landlord suddenly increased my rent by 40% and is threatening eviction if I don\'t pay. Is this legal? What are the rules for rent increase in India?',
    icon: '📈',
    category: 'tenant',
  },
  {
    id: 'consumer-complaint',
    label: 'Consumer complaint against company',
    hinglishLabel: 'Company ke khilaf consumer complaint',
    query: 'I bought a product that was defective and the company is refusing to replace or refund it. How do I file a consumer complaint in India?',
    icon: '🛒',
    category: 'consumer',
  },
  {
    id: 'fir-filing',
    label: 'How to file an FIR',
    hinglishLabel: 'FIR kaise darj karein',
    query: 'How do I file an FIR at a police station in India? What information is needed and what if police refuses to file my FIR?',
    icon: '🚔',
    category: 'criminal',
  },
  {
    id: 'workplace-harassment',
    label: 'Workplace harassment / POSH Act',
    hinglishLabel: 'Workplace harassment / POSH Act',
    query: 'I am facing sexual harassment at my workplace. What are my rights under the POSH Act and what should I do?',
    icon: '⚖️',
    category: 'sensitive',
  },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'rent-agreement',
    title: 'Rent Agreement',
    description: 'Standard 11-month rental agreement with all essential clauses',
    icon: '🏡',
    googleDocUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/copy',
    fields: [
      { id: 'landlord_name', label: 'Landlord\'s Full Name', placeholder: 'e.g., Ramesh Kumar Sharma', type: 'text', required: true },
      { id: 'tenant_name', label: 'Tenant\'s Full Name', placeholder: 'e.g., Priya Singh', type: 'text', required: true },
      { id: 'property_address', label: 'Property Address', placeholder: 'Complete address with pin code', type: 'textarea', required: true },
      { id: 'monthly_rent', label: 'Monthly Rent (₹)', placeholder: 'e.g., 15000', type: 'number', required: true },
      { id: 'security_deposit', label: 'Security Deposit (₹)', placeholder: 'e.g., 45000', type: 'number', required: true },
      { id: 'start_date', label: 'Agreement Start Date', placeholder: '', type: 'date', required: true },
      { id: 'state', label: 'State', placeholder: 'Select state', type: 'select', options: ['Delhi', 'Maharashtra', 'Karnataka', 'Uttar Pradesh'], required: true },
    ],
  },
  {
    id: 'legal-notice',
    title: 'Legal Notice (Security Deposit)',
    description: 'Formal legal notice demanding return of security deposit',
    icon: '📋',
    fields: [
      { id: 'sender_name', label: 'Your Full Name', placeholder: 'e.g., Priya Singh', type: 'text', required: true },
      { id: 'sender_address', label: 'Your Current Address', placeholder: 'Your current address', type: 'textarea', required: true },
      { id: 'landlord_name', label: 'Landlord\'s Full Name', placeholder: 'e.g., Ramesh Kumar Sharma', type: 'text', required: true },
      { id: 'landlord_address', label: 'Landlord\'s Address', placeholder: 'Landlord\'s address', type: 'textarea', required: true },
      { id: 'deposit_amount', label: 'Security Deposit Amount (₹)', placeholder: 'e.g., 45000', type: 'number', required: true },
      { id: 'vacating_date', label: 'Date of Vacating Property', placeholder: '', type: 'date', required: true },
      { id: 'demand_date', label: 'Demand Payment By (Date)', placeholder: '', type: 'date', required: true },
    ],
  },
  {
    id: 'affidavit',
    title: 'General Affidavit',
    description: 'Basic sworn statement / affidavit format for general use',
    icon: '📜',
    fields: [
      { id: 'deponent_name', label: 'Deponent\'s Full Name', placeholder: 'Your full name as per ID', type: 'text', required: true },
      { id: 'deponent_age', label: 'Age', placeholder: 'e.g., 32', type: 'number', required: true },
      { id: 'deponent_address', label: 'Permanent Address', placeholder: 'Full address', type: 'textarea', required: true },
      { id: 'statement', label: 'Statement / Declaration', placeholder: 'What you are declaring...', type: 'textarea', required: true },
      { id: 'place', label: 'Place of Execution', placeholder: 'e.g., New Delhi', type: 'text', required: true },
      { id: 'date', label: 'Date', placeholder: '', type: 'date', required: true },
    ],
  },
  {
    id: 'rti-application',
    title: 'RTI Application',
    description: 'Right to Information application under RTI Act 2005',
    icon: '📮',
    fields: [
      { id: 'applicant_name', label: 'Applicant\'s Full Name', placeholder: 'Your full name', type: 'text', required: true },
      { id: 'applicant_address', label: 'Applicant\'s Address', placeholder: 'Full postal address', type: 'textarea', required: true },
      { id: 'authority_name', label: 'Public Authority Name', placeholder: 'e.g., Municipal Corporation of Delhi', type: 'text', required: true },
      { id: 'information_sought', label: 'Information / Documents Sought', placeholder: 'Clearly describe what information you are seeking...', type: 'textarea', required: true },
      { id: 'period', label: 'Period of Information', placeholder: 'e.g., April 2023 to March 2024', type: 'text', required: false },
    ],
  },
];

export const GEMINI_SYSTEM_PROMPT = `You are NyayaSathi, an AI legal information assistant for India. You provide ONLY general legal information, never personalized legal advice. You must never tell a user exactly what to do in a way that replaces consulting a licensed advocate.

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
This is general legal information only and does not constitute legal advice. Every legal situation is unique. Please consult a licensed advocate or approach your nearest District Legal Services Authority (DLSA) for free legal aid. NyayaSathi is an information tool, not a law firm.

IMPORTANT NOTES:
- If asked about something completely unrelated to law (like cooking, movies, etc.), politely redirect: "I'm NyayaSathi, focused on Indian legal information. Let me help you with any legal questions you have."
- If a case seems very urgent (threats, violence, immediate danger), prioritize safety information and helplines FIRST.
- Always be empathetic and non-judgmental. Legal situations are stressful.
- Be comprehensive but concise. Don't repeat yourself.
- If mentioning the new criminal law codes: Bharat Nyaya Sanhita (BNS) 2023 replaces IPC, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 replaces CrPC — note both old and new section numbers when relevant.`;
