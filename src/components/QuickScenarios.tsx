import React from 'react';
import { QUICK_SCENARIOS } from '../constants';
import type { Language } from '../types';

interface QuickScenariosProps {
  onSelect: (query: string) => void;
  darkMode: boolean;
  language: Language;
}

const categoryLabels: Record<string, { label: string; color: string; darkColor: string }> = {
  tenant: { label: 'Tenant Rights', color: 'bg-blue-100 text-blue-700', darkColor: 'bg-blue-900/40 text-blue-300' },
  consumer: { label: 'Consumer', color: 'bg-green-100 text-green-700', darkColor: 'bg-green-900/40 text-green-300' },
  criminal: { label: 'Criminal Law', color: 'bg-red-100 text-red-700', darkColor: 'bg-red-900/40 text-red-300' },
  sensitive: { label: 'Sensitive', color: 'bg-purple-100 text-purple-700', darkColor: 'bg-purple-900/40 text-purple-300' },
};

export const QuickScenarios: React.FC<QuickScenariosProps> = ({ onSelect, darkMode, language }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-px flex-1 ${darkMode ? 'bg-slate-700' : 'bg-blue-100'}`} />
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          darkMode ? 'bg-slate-800 text-slate-400' : 'bg-blue-50 text-blue-500'
        }`}>
          ⚡ Quick Legal Topics
        </span>
        <div className={`h-px flex-1 ${darkMode ? 'bg-slate-700' : 'bg-blue-100'}`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        {QUICK_SCENARIOS.map((scenario) => {
          const cat = categoryLabels[scenario.category];
          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario.query)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-600 hover:bg-slate-750'
                  : 'bg-white border-blue-100 hover:border-blue-300 hover:bg-blue-50/50 shadow-sm'
              }`}
            >
              <span className="text-xl flex-shrink-0">{scenario.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug truncate ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {language === 'hinglish' ? scenario.hinglishLabel : scenario.label}
                </p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                  darkMode ? cat.darkColor : cat.color
                }`}>
                  {cat.label}
                </span>
              </div>
              <span className={`text-lg opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                →
              </span>
            </button>
          );
        })}
      </div>

      <p className={`text-xs text-center mt-3 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        Or type any legal question in the box below ↓
      </p>
    </div>
  );
};
