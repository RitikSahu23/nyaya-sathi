import type React from 'react';
import { Shield, Scale, BookOpen, FileText, Phone } from 'lucide-react';

interface HeroSectionProps {
  darkMode: boolean;
  onStartChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ darkMode, onStartChat }) => {
  const features = [
    { icon: <Scale className="w-5 h-5" />, title: 'Cites Exact Laws', desc: 'IPC, Consumer Protection Act, RTI, MTA 2021 and more', color: 'blue' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Simple Language', desc: 'Grade-8 level English and Hinglish explanations', color: 'orange' },
    { icon: <FileText className="w-5 h-5" />, title: 'Free Templates', desc: 'Rent agreements, legal notices, affidavits, RTI', color: 'green' },
    { icon: <Phone className="w-5 h-5" />, title: 'Helpline Info', desc: 'NALSA, DLSA, Women Helpline and Tele-Law numbers', color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    blue: darkMode ? 'bg-blue-900/40 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200',
    orange: darkMode ? 'bg-orange-900/40 text-orange-300 border-orange-800' : 'bg-orange-50 text-orange-700 border-orange-200',
    green: darkMode ? 'bg-green-900/40 text-green-300 border-green-800' : 'bg-green-50 text-green-700 border-green-200',
    amber: darkMode ? 'bg-amber-900/40 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div
      className={`relative overflow-hidden py-10 px-6 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
          : 'bg-gradient-to-br from-[#102547] via-[#163768] to-[#0b2447]'
      }`}
    >
      <div className="absolute inset-0 hero-grid opacity-25" />
      <div className="absolute inset-0 mesh-bg animate-aurora opacity-70" />
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-orange-500/20 -translate-y-32 translate-x-24 blur-3xl animate-floatDrift" />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-blue-400/20 translate-y-20 -translate-x-20 blur-3xl animate-floatDrift" />
      <div className="absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-[36%] bg-amber-300/10 blur-3xl animate-tiltGlow" />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 glass-panel border border-white/20 text-white/90 text-sm font-medium mb-6 shadow-lg shadow-blue-950/30 animate-fadeIn">
          <Shield className="w-4 h-4 text-orange-400" />
          Google Solutions Challenge 2026 Submission
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:text-left">
          <div className="animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-[1.05] font-display">
              Justice in Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-white">
                Hands
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-white/85 mb-3">
              Free, simple, and interactive legal guidance for everyday Indian problems.
            </p>
            <p className="text-sm sm:text-base text-white/65 mb-8 max-w-2xl mx-auto lg:mx-0">
              Ask any question about Indian law in plain language. Get relevant sections, real-world explanations,
              suggested next steps, and document support in a UI that feels fast, modern, and human.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <button
                onClick={onStartChat}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-base shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-200"
              >
                Ask a Legal Question
              </button>
              <a
                href="#what-we-wont-do"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 glass-panel hover:bg-white/20 text-white font-medium text-base border border-white/20 hover:scale-105 transition-all duration-200"
              >
                Explore Features
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0">
              {[
                ['24/7', 'Instant legal summaries'],
                ['Acts + Sections', 'Cited in plain language'],
                ['Free Drafts', 'Notices, RTI, affidavits'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-white/15 bg-white/8 glass-panel px-4 py-4 text-left shadow-lg shadow-slate-950/20">
                  <div className="text-xl sm:text-2xl font-extrabold text-white">{value}</div>
                  <div className="mt-1 text-xs sm:text-sm text-white/65 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm animate-floatDrift">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-orange-400/35 to-blue-400/20 blur-2xl" />
            <div className="relative rounded-[28px] border border-white/20 bg-white/12 glass-panel p-5 text-left shadow-2xl shadow-slate-950/35">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Live Preview</p>
                  <h3 className="text-lg font-bold text-white">Legal answer flow</h3>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-orange-300">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ['Law', 'BNS, IPC and IT Act references surfaced first'],
                  ['Meaning', 'Each section explained in simple words'],
                  ['Guidance', 'General suggestion and next steps included'],
                ].map(([title, desc], index) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 animate-fadeIn"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-white/65">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border glass-panel text-center card-hover animate-fadeIn ${colorMap[feat.color]}`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="p-2 rounded-lg bg-white/10">
                {feat.icon}
              </div>
              <h3 className="text-xs font-bold">{feat.title}</h3>
              <p className="text-xs opacity-80 leading-snug hidden sm:block">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div id="what-we-wont-do" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          <div className="bg-white/5 glass-panel border border-white/10 rounded-2xl p-4 card-hover">
            <h4 className="text-sm font-bold text-orange-400 mb-2">What NyayaSathi Does</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>Explains Indian laws in simple words</li>
              <li>Cites exact sections and acts</li>
              <li>Provides free document drafts</li>
              <li>Shares helpline and legal aid info</li>
            </ul>
          </div>
          <div className="bg-white/5 glass-panel border border-white/10 rounded-2xl p-4 card-hover">
            <h4 className="text-sm font-bold text-red-400 mb-2">What We Won&apos;t Do</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>Replace a licensed advocate</li>
              <li>Give case-specific legal strategy</li>
              <li>Predict case outcomes</li>
              <li>Represent you in court</li>
            </ul>
          </div>
          <div className="bg-white/5 glass-panel border border-white/10 rounded-2xl p-4 card-hover">
            <h4 className="text-sm font-bold text-green-400 mb-2">Free Legal Aid</h4>
            <ul className="text-xs text-white/70 space-y-1">
              <li>NALSA Helpline: <strong className="text-white">15100</strong></li>
              <li>Tele-Law: <strong className="text-white">15100</strong></li>
              <li>Women Helpline: <strong className="text-white">181</strong></li>
              <li>DLSA: visit your district office</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
