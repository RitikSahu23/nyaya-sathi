import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Scale, User, BookOpen, Copy, Check } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  darkMode: boolean;
  largeFontMode: boolean;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  onGenerateDoc: (docType: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  darkMode,
  largeFontMode,
  onFeedback,
  onGenerateDoc,
}) => {
  const [lawsExpanded, setLawsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseFont = largeFontMode ? 'text-base' : 'text-sm';

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 animate-fadeIn">
        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm ${
          darkMode
            ? 'bg-blue-700 text-white'
            : 'bg-blue-700 text-white'
        }`}>
          <p className={`${baseFont} leading-relaxed`}>{message.content}</p>
          <p className={`text-xs mt-1 opacity-70`}>
            {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fadeIn">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-md">
        <Scale className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Name tag */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            NyayaSathi
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            ✓ Verified Info
          </span>
          <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Main Content Card */}
        <div className={`rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border transition-all ${
          darkMode
            ? 'bg-slate-800 border-slate-700 text-slate-100'
            : 'bg-white border-blue-100 text-slate-800'
        }`}>
          <div className={`prose prose-sm max-w-none ${largeFontMode ? 'prose-base' : 'prose-sm'} ${
            darkMode
              ? 'prose-invert prose-headings:text-blue-300 prose-strong:text-white prose-a:text-blue-400'
              : 'prose-headings:text-blue-800 prose-strong:text-blue-900 prose-a:text-blue-600'
          }`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className={`text-base font-bold mt-4 mb-2 flex items-center gap-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className={`text-sm font-semibold mt-3 mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 my-2 pl-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-1 my-2 pl-4 list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className={`${baseFont} leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {children}
                  </li>
                ),
                p: ({ children }) => (
                  <p className={`${baseFont} leading-relaxed mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {children}
                  </strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={`border-l-4 pl-3 my-2 italic ${
                    darkMode ? 'border-amber-500 text-amber-300' : 'border-orange-400 text-orange-700'
                  }`}>
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={`underline ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Bare Act Section (Collapsible) */}
        {message.lawSections && message.lawSections.length > 0 && (
          <div className={`rounded-xl border overflow-hidden ${
            darkMode ? 'border-blue-800/50' : 'border-blue-200'
          }`}>
            <button
              onClick={() => setLawsExpanded(!lawsExpanded)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                📚 Bare Act References ({message.lawSections.length} sections)
              </span>
              {lawsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {lawsExpanded && (
              <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-blue-100'}`}>
                {message.lawSections.map((section, idx) => (
                  <div key={idx} className={`px-4 py-3 ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {section.act}
                        </span>
                        <h4 className={`text-sm font-semibold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                          {section.section} — {section.title}
                        </h4>
                        <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {section.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        📖 Source: {section.source}
                      </span>
                      {section.sourceUrl && (
                        <a
                          href={section.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                          View (Planned)
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <div className={`px-4 py-2 text-xs ${darkMode ? 'bg-slate-900/50 text-slate-500' : 'bg-gray-50 text-slate-500'}`}>
                  Sources: India Code (indiacode.nic.in) • PRS Legislative Research (prsindia.org) • Ministry of Housing & Urban Affairs
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate Document CTA */}
        {message.documentType && (
          <button
            onClick={() => onGenerateDoc(message.documentType!)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            📄 Generate Document Template
            <span className="text-xs opacity-80 font-normal">(Free)</span>
          </button>
        )}

        {/* Feedback + Copy Row */}
        <div className="flex items-center gap-3 pt-1">
          <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Was this helpful?
          </span>
          <button
            onClick={() => onFeedback(message.id, 'up')}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
              message.feedback === 'up'
                ? 'bg-green-500 text-white shadow-md'
                : darkMode ? 'text-slate-500 hover:text-green-400 hover:bg-slate-700' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
            }`}
            title="Helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFeedback(message.id, 'down')}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
              message.feedback === 'down'
                ? 'bg-red-500 text-white shadow-md'
                : darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-700' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
            }`}
            title="Not helpful"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className={`ml-auto p-1.5 rounded-lg transition-all hover:scale-110 ${
              copied
                ? 'bg-green-500 text-white'
                : darkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
