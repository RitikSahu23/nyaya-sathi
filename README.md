# NyayaSathi — AI Legal Information Assistant for India

> **"Justice in your hands — Free, Simple, Accessible"**

---

## 🎯 Problem Statement

Access to legal information in India is fragmented, expensive, and intimidating:
- **80%+ of Indians cannot afford a lawyer** for basic legal queries
- Legal documents (rent agreements, notices) cost ₹500–₹5000 from advocates
- Laws are written in complex legalese — inaccessible to the average citizen
- No free, reliable, AI-powered legal information tool exists for Indian law specifically

## 💡 Our Solution: NyayaSathi

An AI-powered **legal information assistant** (not a law firm, not legal advice) that:
1. Answers any question about Indian law in **simple language** (Grade 8 level)
2. **Cites exact sections** — IPC, Consumer Protection Act, Model Tenancy Act 2021, RTI Act, POSH, BNS 2023, and 15+ more acts
3. Provides **free document templates** — rent agreements, legal notices, affidavits, RTI applications
4. Supports **Hinglish** (Hindi-English mix) for wider accessibility
5. Includes **voice input** via Web Speech API (browser-native, free)
6. Always shows **helpline numbers** and encourages professional legal aid

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   USER BROWSER                       │
│                                                      │
│  React + TypeScript + Tailwind CSS (Vite build)     │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Chat UI    │  │  Doc Generator│  │  Sidebar   │ │
│  │  (streaming)│  │  (templates) │  │  (laws/    │ │
│  │             │  │              │  │  helplines)│ │
│  └──────┬──────┘  └──────────────┘  └────────────┘ │
│         │                                            │
│         ▼                                            │
│  ┌─────────────────────────────────────────────────┐│
│  │         Gemini 2.0 Flash API (Free Tier)        ││
│  │         @google/generative-ai SDK               ││
│  │         System: NyayaSathi Legal Prompt         ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User types/speaks a legal question
2. Query sent to Gemini 2.0 Flash with NyayaSathi system prompt
3. Gemini returns structured markdown response with law citations
4. Frontend renders streamed response with section references
5. User can generate documents via template engine (no backend needed)

---

## 🛠️ Tech Stack (100% Free)

| Component | Technology | Cost |
|-----------|-----------|------|
| Frontend | React 19 + TypeScript + Vite | Free |
| Styling | Tailwind CSS 4 | Free |
| AI | Google Gemini 2.0 Flash API | Free tier |
| Document Templates | Client-side text generation | Free |
| Voice Input | Web Speech API (browser-native) | Free |
| Fonts | Google Fonts (Inter + Poppins) | Free |
| Hosting | GitHub Pages / Firebase Hosting | Free |
| Markdown Rendering | react-markdown + remark-gfm | Free |

**No backend. No database. No server costs.**

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ 
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nyayasathi
cd nyayasathi

# 2. Install dependencies
npm install

# 3. Create .env.local with your Gemini API key
echo "GEMINI_API_KEY=AIzaSy..." > .env.local

# 4. Start development server
npm run dev

# 5. Open http://localhost:5173
```

---

## 🌐 Deployment (Recommended: Vercel)

**Users don't need to provide their own API key anymore!** Deploy the backend to Vercel (free tier) and your Gemini API key stays private on the server.

### Quick Deploy Steps:

1. Get your free Gemini API key: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Push code to GitHub
3. Go to [Vercel](https://vercel.com) → Connect your GitHub repo
4. Add environment variable: `GEMINI_API_KEY` = your API key
5. Deploy! 🎉

**No backend coding needed.** Vercel runs `api/gemini.js` as a serverless function automatically.

👉 **Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📋 How It Works
```

### Building for Production
```bash
npm run build
# Output in dist/ — deploy to GitHub Pages or Firebase Hosting
```

---

## ✨ Features

### Core
- [x] **Interactive AI Chat** — Ask any Indian legal question, get structured answers with law citations
- [x] **Streaming responses** — See the answer as it's generated (Gemini streaming API)
- [x] **Quick Scenarios** — One-click buttons for common legal situations
- [x] **Bare Act Panel** — Collapsible section showing exact legal sections cited
- [x] **Hinglish Toggle** — Switch between English and Hindi-English mix
- [x] **State Selector** — Get state-specific legal information (Delhi, Maharashtra, Karnataka, UP)
- [x] **Voice Input** — Speak your question using Web Speech API

### Document Generator
- [x] Rent Agreement (11-month, standard clauses)
- [x] Legal Notice (security deposit return)
- [x] General Affidavit
- [x] RTI Application

### UX / Trust
- [x] Prominent disclaimer on every response
- [x] "Verified Info" badge
- [x] Feedback system (thumbs up/down)
- [x] Copy response button
- [x] Large font toggle for accessibility
- [x] Dark mode
- [x] Mobile-first responsive design
- [x] Emergency helplines sidebar (NALSA, DLSA, Women Helpline, Police)

---

## 📚 Legal Coverage

| Area | Acts Covered |
|------|-------------|
| Tenant Rights | Model Tenancy Act 2021, Delhi Rent Control Act 1958, Maharashtra Rent Control Act 1999 |
| Criminal Law | BNS 2023 (replacing IPC), BNSS 2023 (replacing CrPC), Prevention of Corruption Act |
| Consumer | Consumer Protection Act 2019, Consumer Forum process |
| RTI | Right to Information Act 2005 |
| Women's Rights | POSH Act 2013, Protection of Women from DV Act 2005, Dowry Prohibition Act |
| Property | Transfer of Property Act 1882, Registration Act 1908, Benami Transactions Act |
| Labour | Industrial Disputes Act 1947, Labour Codes 2020 |
| Family | Hindu Marriage Act, Special Marriage Act, Guardianship & Wards Act |
| Financial | Negotiable Instruments Act S.138 (cheque bounce), IBC 2016 |
| Constitutional | Fundamental Rights (Art 14, 19, 21), Writ Petitions |

---

## ⚠️ Safety & Compliance

| Requirement | Implementation |
|-------------|---------------|
| No "AI Lawyer" branding | Uses "Legal Information Assistant" throughout |
| No case-specific advice | System prompt enforces "may consider", "generally" language |
| Prominent disclaimer | DisclaimerBanner + in every AI response |
| Sensitive topics | Helplines shown first, professional help emphasized |
| Source transparency | Every response shows India Code, PRS sources |
| No real party details | System prompt forbids using real case names |

---

## 🔮 Future Roadmap

| Phase | Feature | Timeline |
|-------|---------|----------|
| V2 | Multilingual: Tamil, Telugu, Bengali, Marathi | Q2 2025 |
| V2 | All 28 states' state-specific laws | Q2 2025 |
| V2 | Case law citation (Supreme Court, HCs) via IndianKanoon API | Q3 2025 |
| V3 | Advocate referral network (low-cost) | Q3 2025 |
| V3 | Legal aid application assistance (NALSA) | Q4 2025 |
| V4 | WhatsApp integration for rural access | Q1 2026 |
| V4 | Offline mode (lite) for low-connectivity areas | Q1 2026 |

---

## 📊 Impact Potential

- **450M+** smartphone users in India who can access this
- **80%** of Indians in lower income brackets cannot afford lawyers
- **1 in 3** Indians face tenant/consumer disputes annually
- **Free**: ₹0 vs ₹500–5000 for basic legal templates elsewhere

---

## 🎬 Demo Script (2 minutes)

**[0:00–0:20]** Open homepage → Show hero with "Justice in Your Hands" + trust signals
**[0:20–0:45]** Type: "My landlord won't return my ₹50,000 security deposit" → Show typing indicator → Reveal structured answer with MTA 2021 sections
**[0:45–1:10]** Click "Generate Document Template" → Fill rent notice form → Download template
**[1:10–1:35]** Switch to Hinglish → Ask "consumer complaint kaise karein" → Show Hindi-mix answer
**[1:35–1:50]** Show sidebar helplines → Highlight NALSA 15100
**[1:50–2:00]** Show disclaimer banner → "This is info, not advice — see an advocate for your case"

---

## 📋 Legal Content Checklist

### ✅ Currently Covered
- Tenant rights (Model Tenancy Act 2021 + state acts)
- Consumer protection (CPA 2019)
- RTI process (RTI Act 2005)
- Basic criminal law (BNS 2023)
- FIR filing process
- POSH Act overview
- Domestic violence protections
- Cheque bounce (NI Act S.138)
- Constitutional rights overview

### 🔄 Not Yet Covered (Planned)
- Case law / Supreme Court judgments
- State-specific stamp duty rates
- Property registration procedures
- Tax-related legal issues
- Immigration / visa law
- Corporate / startup law

### 🚫 Will Not Cover (By Design)
- Personalized legal strategy for active cases
- Prediction of case outcomes
- Representation in any legal proceeding
- Attorney-client privileged communication

---

## 📝 Pitch Deck Outline

**Slide 1: Problem** — 450M Indians can't access basic legal info; laws in legalese; templates cost ₹500+
**Slide 2: Solution** — NyayaSathi: AI legal info assistant, free, simple, in your language
**Slide 3: Demo** — Live screenshot: question → structured answer with law sections
**Slide 4: Features** — Chat + Documents + Voice + Hinglish + Helplines
**Slide 5: Impact** — Before/After; 0 cost; 15+ acts covered; mobile-first
**Slide 6: Safety** — Disclaimer-first; no advice; cite sources; helplines for sensitive topics
**Slide 7: Roadmap** — V2: multilingual; V3: advocate referral; V4: WhatsApp + offline

---

## 🙏 Acknowledgments

- **India Code** (indiacode.nic.in) — official source for Indian legislation
- **PRS Legislative Research** (prsindia.org) — bill summaries and analysis
- **NALSA** — National Legal Services Authority for legal aid framework
- **Google AI Studio** — free Gemini API access

---

*Built with ❤️ for Google Solutions Challenge 2024 | NyayaSathi — न्यायसाथी*
