import React, { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface DisclaimerBannerProps {
  darkMode: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={`border-b transition-all duration-300 ${
      darkMode
        ? 'bg-amber-900/30 border-amber-700/50'
        : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                ⚠️ Important Disclaimer
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                darkMode ? 'bg-amber-800/50 text-amber-300' : 'bg-amber-200 text-amber-800'
              }`}>
                Not Legal Advice
              </span>
            </div>
            <p className={`text-sm mt-1 ${darkMode ? 'text-amber-200/80' : 'text-amber-700'}`}>
              NyayaSathi provides general legal <strong>information</strong> only — not legal advice.
              {!expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className={`ml-1 underline font-medium inline-flex items-center gap-0.5 ${darkMode ? 'text-amber-300' : 'text-amber-600'}`}
                >
                  Read more <ChevronDown className="w-3 h-3" />
                </button>
              )}
            </p>
            {expanded && (
              <div className={`mt-2 text-sm space-y-1 ${darkMode ? 'text-amber-200/70' : 'text-amber-700'}`}>
                <p>• Every legal situation is unique. This tool cannot account for your specific facts, documents, or circumstances.</p>
                <p>• For free legal aid, contact your nearest <strong>District Legal Services Authority (DLSA)</strong> or call <strong>NALSA Helpline: 15100</strong>.</p>
                <p>• For Tele-Law services (free): Call <strong>15100</strong> or visit <a href="https://tele-law.in" target="_blank" rel="noopener noreferrer" className="underline">tele-law.in</a>.</p>
                <p>• NyayaSathi is an information tool. Always consult a licensed advocate for your specific legal matter.</p>
                <button
                  onClick={() => setExpanded(false)}
                  className={`mt-1 underline font-medium inline-flex items-center gap-0.5 ${darkMode ? 'text-amber-300' : 'text-amber-600'}`}
                >
                  Show less <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className={`p-1 rounded-full flex-shrink-0 transition-colors ${
              darkMode ? 'text-amber-400 hover:bg-amber-800/50' : 'text-amber-600 hover:bg-amber-200'
            }`}
            title="Dismiss (disclaimer still applies)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
