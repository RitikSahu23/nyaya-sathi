import { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, ExternalLink, Phone } from 'lucide-react';

interface LegalSidebarProps {
  darkMode: boolean;
  onDocumentGenerator: () => void;
}

const HELPLINES = [
  { name: 'NALSA / Legal Aid', number: '15100', desc: 'Free legal aid (National)' },
  { name: 'Tele-Law Service', number: '15100', desc: 'Free legal consultation' },
  { name: 'Women Helpline', number: '181', desc: 'Domestic violence / safety' },
  { name: 'Police Emergency', number: '100', desc: 'Immediate danger' },
  { name: 'One Stop Centre', number: '181', desc: 'Violence against women' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: 'Mental health support' },
];

const KEY_ACTS = [
  { name: 'Model Tenancy Act 2021', abbr: 'MTA', url: 'https://mohua.gov.in' },
  { name: 'Consumer Protection Act 2019', abbr: 'CPA', url: 'https://consumeraffairs.nic.in' },
  { name: 'RTI Act 2005', abbr: 'RTI', url: 'https://rtionline.gov.in' },
  { name: 'POSH Act 2013', abbr: 'POSH', url: 'https://wcd.nic.in' },
  { name: 'Domestic Violence Act 2005', abbr: 'PWDVA', url: 'https://indiacode.nic.in' },
  { name: 'Bharat Nyaya Sanhita 2023', abbr: 'BNS', url: 'https://indiacode.nic.in' },
  { name: 'Transfer of Property Act 1882', abbr: 'TPA', url: 'https://indiacode.nic.in' },
  { name: 'Cheque Bounce — NI Act S.138', abbr: 'NIA', url: 'https://indiacode.nic.in' },
];

export const LegalSidebar: React.FC<LegalSidebarProps> = ({ darkMode, onDocumentGenerator }) => {
  const [helplinesExpanded, setHelplinesExpanded] = useState(true);
  const [actsExpanded, setActsExpanded] = useState(true);

  const sectionClass = `rounded-xl border overflow-hidden mb-3 ${
    darkMode ? 'border-slate-700' : 'border-blue-100'
  }`;
  const headerClass = `flex items-center justify-between px-4 py-3 text-sm font-semibold cursor-pointer transition-colors ${
    darkMode
      ? 'bg-slate-800 text-slate-200 hover:bg-slate-750'
      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
  }`;

  return (
    <div className="space-y-3">
      {/* Trust Badge */}
      <div className={`px-4 py-3 rounded-xl border ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Scale className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`} />
          <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-blue-800'}`}>
            Source Transparency
          </span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
            darkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            ✓ Verified
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          All legal references sourced from:
        </p>
        <ul className={`text-xs mt-1 space-y-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <li>• India Code (indiacode.nic.in)</li>
          <li>• PRS Legislative Research</li>
          <li>• Ministry of Housing & Urban Affairs</li>
          <li>• National Consumer Helpline</li>
        </ul>
      </div>

      {/* Document Generator CTA */}
      <button
        onClick={onDocumentGenerator}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
      >
        <span className="text-xl">📄</span>
        <div className="text-left">
          <p className="font-bold">Generate Documents</p>
          <p className="text-xs opacity-80">Rent agreement, notices, affidavits</p>
        </div>
        <span className="ml-auto text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">FREE</span>
      </button>

      {/* Helplines */}
      <div className={sectionClass}>
        <button className={headerClass} onClick={() => setHelplinesExpanded(!helplinesExpanded)}>
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency & Legal Helplines
          </span>
          {helplinesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {helplinesExpanded && (
          <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-blue-50'}`}>
            {HELPLINES.map((h, i) => (
              <div key={i} className={`px-4 py-2.5 ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {h.name}
                  </span>
                  <a
                    href={`tel:${h.number}`}
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700'
                    } hover:opacity-80 transition-opacity`}
                  >
                    📞 {h.number}
                  </a>
                </div>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Acts Reference */}
      <div className={sectionClass}>
        <button className={headerClass} onClick={() => setActsExpanded(!actsExpanded)}>
          <span className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Key Indian Laws
          </span>
          {actsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {actsExpanded && (
          <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-blue-50'}`}>
            {KEY_ACTS.map((act, i) => (
              <div key={i} className={`px-4 py-2.5 flex items-center justify-between ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
                <div>
                  <span className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {act.name}
                  </span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                    darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {act.abbr}
                  </span>
                </div>
                <a
                  href={act.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${darkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}
                  title="View source (planned)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Impact Block */}
      <div className={`px-4 py-4 rounded-xl border ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100 shadow-sm'
      }`}>
        <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          🎯 Before & After NyayaSathi
        </h4>
        <div className="space-y-2">
          <div className={`text-xs p-2 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'}`}>
            <strong>Before:</strong> Paid lawyers for basic info, unclear laws, ₹500+ for templates
          </div>
          <div className={`text-xs p-2 rounded-lg ${darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700'}`}>
            <strong>After:</strong> Free verified info, cited sections, free templates in minutes
          </div>
        </div>
      </div>

      {/* State Badge */}
      <div className={`px-4 py-3 rounded-xl border text-center ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-xs font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          🗺️ Delhi-Focused Prototype
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Maharashtra, Karnataka, UP also covered. More states coming soon.
        </p>
      </div>
    </div>
  );
};
