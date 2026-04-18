import type React from 'react';
import { Shield, Scale, BookOpen, FileText, Phone } from 'lucide-react';

interface HeroSectionProps {
  darkMode: boolean;
  onStartChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ darkMode, onStartChat }) => {
  const features = [
    { icon: <Scale className="w-5 h-5" />, title: 'Cites Exact Laws', desc: 'IPC, Consumer Protection Act, RTI, MTA 2021 & more', color: 'blue' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Simple Language', desc: 'Grade-8 level English & Hinglish explanations', color: 'orange' },
    { icon: <FileText className="w-5 h-5" />, title: 'Free Templates', desc: 'Rent agreements, legal notices, affidavits, RTI', color: 'green' },
    { icon: <Phone className="w-5 h-5" />, title: 'Helpline Info', desc: 'NALSA, DLSA, Women Helpline & Tele-Law numbers', color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    blue: darkMode ? 'bg-blue-900/40 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200',
    orange: darkMode ? 'bg-orange-900/40 text-orange-300 border-orange-800' : 'bg-orange-50 text-orange-700 border-orange-200',
    green: darkMode ? 'bg-green-900/40 text-green-300 border-green-800' : 'bg-green-50 text-green-700 border-green-200',
    purple: darkMode ? 'bg-purple-900/40 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className={`relative overflow-hidden py-10 px-6 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950'
    }`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-orange-500/10 -translate-y-32 translate-x-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-400/10 translate-y-16 -translate-x-16 blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
          <Shield className="w-4 h-4 text-orange-400" />
          Google Solutions Challenge 2024 Submission
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight font-display">
          Justice in Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
            Hands
          </span>
        </h1>
        <p className="text-xl font-semibold text-white/80 mb-2">
          Justice in your hands — Free, Simple, Accessible
        </p>
        <p className="text-sm text-white/60 mb-8 max-w-xl mx-auto">
          Ask any question about Indian law in plain language. Get relevant sections, simple explanations, 
          and free document templates — powered by AI, guided by Indian jurisprudence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={onStartChat}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-base shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-200"
          >
            ⚖️ Ask a Legal Question
          </button>
          <a
            href="#what-we-wont-do"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-base border border-white/20 hover:scale-105 transition-all duration-200"
          >
            📋 How It Works
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border backdrop-blur-sm text-center ${colorMap[feat.color]}`}
            >
              <div className="p-2 rounded-lg bg-white/10">
                {feat.icon}
              </div>
              <h3 className="text-xs font-bold">{feat.title}</h3>
              <p className="text-xs opacity-80 leading-snug hidden sm:block">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* What We Won't Do section */}
        <div id="what-we-wont-do" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-bold text-orange-400 mb-2">✅ What NyayaSathi Does</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• Explains Indian laws in simple words</li>
              <li>• Cites exact sections & acts</li>
              <li>• Provides free document drafts</li>
              <li>• Shares helpline & legal aid info</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-400 mb-2">🚫 What We Won't Do</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• Replace a licensed advocate</li>
              <li>• Give case-specific legal strategy</li>
              <li>• Predict case outcomes</li>
              <li>• Represent you in court</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-bold text-green-400 mb-2">🆓 Free Legal Aid</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• NALSA Helpline: <strong className="text-white">15100</strong></li>
              <li>• Tele-Law: <strong className="text-white">15100</strong></li>
              <li>• Women Helpline: <strong className="text-white">181</strong></li>
              <li>• DLSA (visit your district)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
