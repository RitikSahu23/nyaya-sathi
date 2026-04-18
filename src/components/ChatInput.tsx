import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import type { Language } from '../types';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  darkMode: boolean;
  language: Language;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, darkMode, language }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI: any =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setVoiceSupported(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition: any = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hinglish' ? 'hi-IN' : 'en-IN';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transcript = Array.from(event.results as any[])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((r: any) => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const placeholder =
    language === 'hinglish'
      ? 'Koi bhi kanoon ka sawaal poochein... (e.g., "Mera landlord deposit wapas nahi de raha")'
      : 'Ask any legal question in India... (e.g., "What are my rights as a tenant?")';

  return (
    <div className={`border-t transition-all duration-300 ${
      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-blue-100'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Voice listening indicator */}
        {isListening && (
          <div className={`flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg text-sm ${
            darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'
          }`}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Listening... speak your question
            {language === 'hinglish' ? ' (Hindi ya English mein bolein)' : ''}
          </div>
        )}

        <div className={`flex items-end gap-2 rounded-2xl border p-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 ${
          darkMode
            ? 'bg-slate-800 border-slate-600'
            : 'bg-gray-50 border-blue-200'
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className={`flex-1 resize-none bg-transparent text-sm leading-relaxed focus:outline-none px-2 py-1.5 min-h-[38px] ${
              darkMode ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
            }`}
          />

          <div className="flex items-center gap-1 flex-shrink-0 pb-1">
            {/* Voice Input Button */}
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                disabled={isLoading}
                title={isListening ? 'Stop listening' : 'Voice input'}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg animate-pulse'
                    : darkMode
                    ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                input.trim() && !isLoading
                  ? 'bg-blue-700 text-white shadow-md hover:bg-blue-800 hover:shadow-lg'
                  : darkMode
                  ? 'bg-slate-700 text-slate-500'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            ⚠️ General info only • Not legal advice • 
            {language === 'hinglish' ? ' Yeh sirf jaankari hai, legal advice nahi' : ' Consult a licensed advocate'}
          </p>
          <span className={`text-xs ${
            input.length > 800
              ? darkMode ? 'text-red-400' : 'text-red-500'
              : darkMode ? 'text-slate-600' : 'text-slate-400'
          }`}>
            {input.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};
