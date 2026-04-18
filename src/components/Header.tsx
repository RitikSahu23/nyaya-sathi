import React, { useState } from 'react';
import { Scale, Menu, X, Globe, Sun, Moon, Type } from 'lucide-react';
import type { Language } from '../types';
import { INDIAN_STATES } from '../constants';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  largeFontMode: boolean;
  setLargeFontMode: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  selectedState,
  setSelectedState,
  darkMode,
  setDarkMode,
  largeFontMode,
  setLargeFontMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      darkMode
        ? 'bg-slate-900/95 border-slate-700 backdrop-blur-md'
        : 'bg-white/95 border-blue-100 backdrop-blur-md shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <div>
              <h1 className={`text-xl font-bold font-display tracking-tight ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                NyayaSathi
              </h1>
              <p className={`text-xs font-medium ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                Legal Information Assistant
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* State Selector */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className={`text-sm pl-3 pr-8 py-2 rounded-lg border font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  darkMode
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <option value="">🗺️ All India</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state.id} value={state.name} disabled={!state.available}>
                    {state.available ? '' : '🔒 '}{state.name}{!state.available ? ' (Soon)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'english' ? 'hinglish' : 'english')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                language === 'hinglish'
                  ? 'bg-orange-500 border-orange-400 text-white shadow-md'
                  : darkMode
                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'english' ? 'English' : 'Hinglish'}</span>
            </button>

            {/* Font Size Toggle */}
            <button
              onClick={() => setLargeFontMode(!largeFontMode)}
              title="Toggle large font"
              className={`p-2 rounded-lg border transition-all hover:scale-105 ${
                largeFontMode
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : darkMode
                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle dark mode"
              className={`p-2 rounded-lg border transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-yellow-500 border-yellow-400 text-slate-900 hover:bg-yellow-400'
                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-white' : 'text-blue-800'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 pt-2 space-y-3 border-t mt-2 ${darkMode ? 'border-slate-700' : 'border-blue-100'}`}>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setMobileMenuOpen(false); }}
              className={`w-full text-sm px-3 py-2 rounded-lg border font-medium ${
                darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <option value="">🗺️ All India</option>
              {INDIAN_STATES.map((state) => (
                <option key={state.id} value={state.name} disabled={!state.available}>
                  {state.name}{!state.available ? ' (Soon)' : ''}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => { setLanguage(language === 'english' ? 'hinglish' : 'english'); setMobileMenuOpen(false); }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
                  language === 'hinglish' ? 'bg-orange-500 text-white border-orange-400' : darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-blue-700 border-blue-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                {language === 'english' ? 'Switch to Hinglish' : 'Switch to English'}
              </button>
              <button
                onClick={() => setLargeFontMode(!largeFontMode)}
                className={`px-3 py-2 rounded-lg border text-sm ${largeFontMode ? 'bg-blue-600 text-white border-blue-500' : darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-blue-700 border-blue-200'}`}
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-yellow-500 border-yellow-400 text-slate-900' : 'bg-white border-blue-200 text-blue-700'}`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
