import { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HeroSection } from './components/HeroSection';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickScenarios } from './components/QuickScenarios';
import { DocumentGenerator } from './components/DocumentGenerator';
import { LegalSidebar } from './components/LegalSidebar';
import { TypingIndicator } from './components/TypingIndicator';
import { sendMessageToGemini } from './gemini';
import type { GeminiMessage } from './gemini';
import type { Message, Language } from './types';
import { Scale, RefreshCw, PanelRightOpen, PanelRightClose } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [selectedState, setSelectedState] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [largeFontMode, setLargeFontMode] = useState(false);
  const [showDocGenerator, setShowDocGenerator] = useState(false);
  const [docGeneratorTemplate, setDocGeneratorTemplate] = useState<string | undefined>();
  const [showHero, setShowHero] = useState(true);
  const [chatHistory, setChatHistory] = useState<GeminiMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [messages, isLoading, streamingContent]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    setError(null);
    setShowHero(false);
    setStreamingContent('');

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const newHistory: GeminiMessage[] = [
      ...chatHistory,
      { role: 'user', parts: [{ text: userInput }] },
    ];

    try {
      let fullResponse = '';
      const assistantId = generateId();

      // Add placeholder assistant message for streaming
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      await sendMessageToGemini(
        userInput,
        chatHistory,
        language,
        selectedState,
        (chunk) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullResponse } : m
            )
          );
        }
      );

      setStreamingContent('');

      // Update chat history for Gemini context
      const updatedHistory: GeminiMessage[] = [
        ...newHistory,
        { role: 'model', parts: [{ text: fullResponse }] },
      ];
      setChatHistory(updatedHistory.slice(-20)); // Keep last 20 turns for context

      // Check if document generation is relevant
      const lowerResponse = fullResponse.toLowerCase();
      const lowerInput = userInput.toLowerCase();
      let docType: string | undefined;
      if (lowerInput.includes('rent agreement') || lowerInput.includes('rental agreement') || lowerResponse.includes('rent agreement template')) {
        docType = 'rent-agreement';
      } else if (lowerInput.includes('legal notice') || lowerInput.includes('security deposit')) {
        docType = 'legal-notice';
      } else if (lowerInput.includes('affidavit')) {
        docType = 'affidavit';
      } else if (lowerInput.includes('rti') || lowerInput.includes('right to information')) {
        docType = 'rti-application';
      }

      if (docType) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, documentType: docType } : m
          )
        );
      }

    } catch (err) {
      setIsLoading(false);
      setStreamingContent('');

      const errMsg = err instanceof Error ? err.message : 'Unknown error';

      setError(
        errMsg.includes('Rate limit exceeded')
          ? errMsg // Show the detailed rate limit message
          : errMsg.includes('quota')
          ? 'Rate limit reached. Please wait a moment and try again.'
          : errMsg.includes('unavailable')
          ? 'The service is temporarily unavailable. Please try again in a moment.'
          : errMsg.includes('Cannot connect')
          ? 'Cannot connect to backend. Check your internet or API key.'
          : 'Something went wrong. Please try again.'
      );

      // Remove empty assistant message
      setMessages((prev) => prev.filter((m) => m.content !== '' || m.role === 'user'));
    }
  }, [chatHistory, language, selectedState]);

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => m.id === messageId ? { ...m, feedback } : m)
    );
  };

  const handleGenerateDoc = (docType: string) => {
    setDocGeneratorTemplate(docType);
    setShowDocGenerator(true);
  };

  const handleClearChat = () => {
    setMessages([]);
    setChatHistory([]);
    setStreamingContent('');
    setShowHero(true);
    setError(null);
  };

  const baseFontClass = largeFontMode ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    } ${largeFontMode ? 'text-base' : ''}`}>
      <div
        className={`pointer-events-none fixed inset-0 -z-10 ${
          darkMode
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_26%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,#f8fbff,#eef4ff)]'
        }`}
      />

      {/* Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        largeFontMode={largeFontMode}
        setLargeFontMode={setLargeFontMode}
      />

      {/* Disclaimer Banner */}
      <DisclaimerBanner darkMode={darkMode} />

      {/* Hero Section */}
      {showHero && (
        <HeroSection
          darkMode={darkMode}
          onStartChat={() => {
            setShowHero(false);
            setTimeout(() => {
              document.getElementById('chat-input')?.focus();
            }, 100);
          }}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Chat Toolbar */}
          {!showHero && (
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
              darkMode ? 'bg-slate-950/70 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-blue-100 backdrop-blur-md'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  <Scale className="w-4 h-4" />
                </div>
                <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  NyayaSathi Chat
                </span>
                {selectedState && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    📍 {selectedState}
                  </span>
                )}
                {language === 'hinglish' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-orange-900/40 text-orange-300' : 'bg-orange-100 text-orange-700'
                  }`}>
                    🌐 Hinglish
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                }`}>
                  {messages.filter(m => m.role === 'user').length} queries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  title="Clear chat"
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  title="Toggle sidebar"
                  className={`hidden lg:flex p-1.5 rounded-lg transition-colors ${
                    darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  {sidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto"
          >
            {showHero ? (
              /* Quick Scenarios on Hero */
              <div className="max-w-4xl mx-auto px-4 py-6">
                <QuickScenarios
                  onSelect={handleSendMessage}
                  darkMode={darkMode}
                  language={language}
                />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

                {/* Welcome message if no messages yet */}
                {messages.length === 0 && !isLoading && (
                  <div className={`text-center py-8 animate-fadeIn ${baseFontClass}`}>
                    <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900/20 animate-floatDrift">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                      Welcome! I'm NyayaSathi 🙏
                    </h2>
                    <p className={`text-sm max-w-sm mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Ask me any question about Indian law — tenant rights, consumer disputes, criminal law, RTI, 
                      family law, and more. I'll cite the exact sections and explain simply.
                    </p>
                    <div className="mt-6">
                      <QuickScenarios
                        onSelect={handleSendMessage}
                        darkMode={darkMode}
                        language={language}
                      />
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    darkMode={darkMode}
                    largeFontMode={largeFontMode}
                    onFeedback={handleFeedback}
                    onGenerateDoc={handleGenerateDoc}
                  />
                ))}

                {/* Typing Indicator */}
                {isLoading && <TypingIndicator darkMode={darkMode} />}

                {/* Error Message */}
                {error && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl border animate-fadeIn ${
                    darkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold">Error</p>
                      <p className="text-xs mt-0.5">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-xs underline opacity-70 hover:opacity-100"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div id="chat-input">
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              darkMode={darkMode}
              language={language}
            />
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && !showHero && (
          <div className={`hidden lg:block w-72 flex-shrink-0 overflow-y-auto border-l p-4 transition-all duration-300 ${
            darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-blue-100'
          }`}>
            <LegalSidebar
              darkMode={darkMode}
              onDocumentGenerator={() => {
                setDocGeneratorTemplate(undefined);
                setShowDocGenerator(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile Sidebar Toggle */}
      {!showHero && (
        <div className={`lg:hidden fixed bottom-20 right-4 z-40`}>
          <button
            onClick={() => {
              setDocGeneratorTemplate(undefined);
              setShowDocGenerator(true);
            }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-lg hover:scale-105 transition-all"
          >
            📄 Docs
          </button>
        </div>
      )}

      {/* Document Generator Modal */}
      {showDocGenerator && (
        <DocumentGenerator
          darkMode={darkMode}
          initialTemplate={docGeneratorTemplate}
          onClose={() => { setShowDocGenerator(false); setDocGeneratorTemplate(undefined); }}
        />
      )}
    </div>
  );
}
