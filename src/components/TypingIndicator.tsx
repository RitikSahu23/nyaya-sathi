import React from 'react';
import { Scale } from 'lucide-react';

interface TypingIndicatorProps {
  darkMode: boolean;
}

const steps = [
  'Reading your query...',
  'Analyzing relevant Indian laws...',
  'Checking sections & citations...',
  'Drafting your response...',
];

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ darkMode }) => {
  const [stepIndex, setStepIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 animate-fadeIn">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-md">
        <Scale className="w-4 h-4 text-white animate-pulse" />
      </div>
      <div className={`rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'
      }`}>
        <div className="flex items-center gap-3">
          {/* Animated dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
                style={{
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span className={`text-sm font-medium transition-all duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {steps[stepIndex]}
          </span>
        </div>

        {/* Law icons pulsing */}
        <div className="flex gap-2 mt-3">
          {['⚖️', '📚', '🔍', '📋'].map((icon, i) => (
            <span
              key={i}
              className="text-base"
              style={{
                animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
                opacity: 0.6,
              }}
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
