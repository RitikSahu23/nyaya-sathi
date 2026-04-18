import { useState } from 'react';
import { Key, ExternalLink, X, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  darkMode: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ darkMode, onSave, onClose }) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!key.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    if (!key.startsWith('AIza')) {
      setError('This doesn\'t look like a valid Gemini API key (should start with AIza...)');
      return;
    }
    onSave(key.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-blue-100'
      }`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Enter Gemini API Key
                </h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Free tier • Stored only in your browser session
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Instructions */}
          <div className={`text-sm rounded-xl p-4 space-y-2 border ${
            darkMode ? 'bg-blue-900/20 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p className="font-semibold">How to get your FREE Gemini API Key:</p>
            <ol className="text-xs space-y-1 list-decimal list-inside opacity-90">
              <li>Go to <strong>Google AI Studio</strong> (aistudio.google.com)</li>
              <li>Sign in with your Google account</li>
              <li>Click "<strong>Get API Key</strong>" → "Create API Key"</li>
              <li>Copy the key (starts with AIza...)</li>
              <li>Paste it below ↓</li>
            </ol>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs font-semibold mt-2 hover:underline ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Google AI Studio →
            </a>
          </div>

          {/* Input */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => { setKey(e.target.value); setError(''); }}
                placeholder="AIzaSy..."
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className={`w-full text-sm px-4 py-3 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-all ${
                  darkMode
                    ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                } ${error ? 'border-red-500 focus:ring-red-400' : ''}`}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Privacy note */}
          <div className={`text-xs px-3 py-2 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'}`}>
            🔒 Your API key is stored only in your browser session memory and never sent to any server except Google's API directly.
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                darkMode
                  ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              Start Using NyayaSathi →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
