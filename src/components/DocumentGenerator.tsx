import React, { useState } from 'react';
import { X, FileText, Download, ExternalLink, ChevronDown, Printer } from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../constants';
import type { DocumentTemplate } from '../types';

interface DocumentGeneratorProps {
  darkMode: boolean;
  initialTemplate?: string;
  onClose: () => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  darkMode,
  initialTemplate,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(
    initialTemplate
      ? DOCUMENT_TEMPLATES.find((t) => t.id === initialTemplate) || DOCUMENT_TEMPLATES[0]
      : DOCUMENT_TEMPLATES[0]
  );
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    const text = generateDocumentText(selectedTemplate, formData);
    setGeneratedText(text);
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
  };

  const handleDownloadHTML = () => {
    if (!selectedTemplate) return;
    const htmlContent = generateDocumentHTML(selectedTemplate, formData);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.title.replace(/\s+/g, '_')}_NyayaSathi.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.title.replace(/\s+/g, '_')}_NyayaSathi.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPreview = () => {
    if (!selectedTemplate) return;
    const htmlContent = generateDocumentHTML(selectedTemplate, formData);
    const newWindow = window.open('', '', 'height=600,width=800');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 250);
    }
  };

  const isFormValid = () => {
    if (!selectedTemplate) return false;
    return selectedTemplate.fields
      .filter((f) => f.required)
      .every((f) => formData[f.id]?.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-blue-100'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          darkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-blue-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Document Template Generator
              </h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Free • Fill in fields → Copy or Download
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-blue-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!generated ? (
            <div className="p-6 space-y-5">
              {/* Template Selector */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  Select Document Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DOCUMENT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => { setSelectedTemplate(template); setFormData({}); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        selectedTemplate?.id === template.id
                          ? darkMode
                            ? 'bg-blue-900/50 border-blue-600 text-blue-300'
                            : 'bg-blue-700 border-blue-700 text-white'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-lg">{template.icon}</span>
                      <div>
                        <p className="text-xs font-semibold">{template.title}</p>
                        <p className={`text-xs opacity-70 hidden sm:block`}>{template.description.substring(0, 30)}…</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              {selectedTemplate && (
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    <ChevronDown className="w-4 h-4" />
                    Fill in the Details
                  </div>
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id}>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData((p) => ({ ...p, [field.id]: e.target.value }))}
                          rows={3}
                          className={`w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all ${
                            darkMode
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                          }`}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData((p) => ({ ...p, [field.id]: e.target.value }))}
                          className={`w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData((p) => ({ ...p, [field.id]: e.target.value }))}
                          className={`w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            darkMode
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                          }`}
                        />
                      )}
                    </div>
                  ))}

                  {/* Disclaimer */}
                  <div className={`text-xs px-3 py-2 rounded-lg ${darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                    ⚠️ These are basic draft templates only. Have a licensed advocate review before using for any legal purpose.
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!isFormValid()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    📄 Generate Draft Template
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Template Generated Successfully!
                </h3>
              </div>

              <div className={`rounded-xl border p-6 leading-relaxed max-h-72 overflow-y-auto ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`} style={{fontFamily: 'Georgia, serif', fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                {generatedText}
              </div>

              <div className={`text-xs px-3 py-2 rounded-lg ${darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                ⚠️ <strong>Important:</strong> This is a draft template only. You must get it reviewed and stamped by a licensed advocate before use. For stamped agreements, visit your local Sub-Registrar office.
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:scale-105 ${
                    darkMode
                      ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  📋 Copy Text
                </button>
                <button
                  onClick={handleDownloadHTML}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Formatted
                </button>
                <button
                  onClick={handlePrintPreview}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print Preview
                </button>
                {selectedTemplate?.googleDocUrl && (
                  <a
                    href={selectedTemplate.googleDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-600 hover:to-orange-700 hover:scale-105 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Google Docs
                  </a>
                )}
                <button
                  onClick={() => setGenerated(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  ← Edit Details
                </button>
              </div>

              <div className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                💡 Tip: To get a PDF — Paste the text into Google Docs → File → Download as PDF
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function generateDocumentText(template: DocumentTemplate, data: Record<string, string>): string {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  switch (template.id) {
    case 'rent-agreement':
      return `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is entered into on ${data.start_date || today}

BETWEEN:
Landlord: ${data.landlord_name || '[LANDLORD NAME]'}
(hereinafter referred to as "Landlord")

AND:
Tenant: ${data.tenant_name || '[TENANT NAME]'}
(hereinafter referred to as "Tenant")

PROPERTY ADDRESS:
${data.property_address || '[PROPERTY ADDRESS]'}

TERMS AND CONDITIONS:

1. TERM: This Agreement is for a period of 11 (eleven) months, commencing from ${data.start_date || '[START DATE]'}.

2. RENT: The monthly rent is ₹${data.monthly_rent || '[AMOUNT]'}/- (Rupees ${data.monthly_rent ? numberToWords(parseInt(data.monthly_rent)) : '[AMOUNT IN WORDS]'} only), payable on or before the 5th of each month.

3. SECURITY DEPOSIT: The Tenant has paid ₹${data.security_deposit || '[AMOUNT]'}/- as refundable security deposit, to be returned within 30 days of vacating the premises after deducting legitimate dues.

4. USE OF PREMISES: The premises shall be used only for residential purposes.

5. MAINTENANCE: The Tenant shall maintain the property in good condition. Minor repairs under ₹500 shall be borne by the Tenant. Major structural repairs are the Landlord's responsibility.

6. UTILITIES: The Tenant shall pay electricity, water, and other utility bills as per actual usage.

7. SUBLETTING: The Tenant shall not sublet the premises without prior written consent of the Landlord.

8. TERMINATION: Either party may terminate this Agreement by giving 30 (thirty) days' written notice.

9. RENT INCREASE: Rent shall not be increased during the 11-month term without mutual written agreement.

10. GOVERNING LAW: This Agreement is governed by the laws of ${data.state || 'India'} and the Model Tenancy Act 2021.

11. DISPUTE RESOLUTION: Any disputes shall first be attempted to be resolved through mutual discussion. If unresolved, either party may approach the Rent Authority as per the Model Tenancy Act 2021 or appropriate civil court.

IN WITNESS WHEREOF, the parties have signed this Agreement on the date first above written.

LANDLORD:                              TENANT:
${data.landlord_name || '_________________'}          ${data.tenant_name || '_________________'}
(Signature)                            (Signature)

WITNESSES:
1. Name: _________________  Signature: _________________
2. Name: _________________  Signature: _________________

NOTE: This is a draft template generated by NyayaSathi (AI Legal Information Tool). 
This document should be reviewed by a licensed advocate before execution. 
For legal validity, stamp duty must be paid and the agreement registered as per ${data.state || 'your state'} law.
⚠️ This does not constitute legal advice.`;

    case 'legal-notice':
      return `LEGAL NOTICE

Date: ${today}

From:
${data.sender_name || '[YOUR NAME]'}
${data.sender_address || '[YOUR ADDRESS]'}

To:
${data.landlord_name || '[LANDLORD NAME]'}
${data.landlord_address || '[LANDLORD ADDRESS]'}

Sub: LEGAL NOTICE FOR RETURN OF SECURITY DEPOSIT — WITHOUT PREJUDICE

Dear Sir/Madam,

Under instruction from and on behalf of my client ${data.sender_name || '[CLIENT NAME]'}, I hereby serve this Legal Notice upon you as follows:

1. That my client vacated your residential premises at the above-mentioned address on ${data.vacating_date || '[DATE]'} after duly giving notice and handing over possession.

2. That at the time of tenancy commencement, my client had paid a security deposit of ₹${data.deposit_amount || '[AMOUNT]'}/- (Rupees ${data.deposit_amount ? numberToWords(parseInt(data.deposit_amount)) : '[AMOUNT IN WORDS]'} only) to you.

3. That despite repeated requests, you have failed and neglected to return the said security deposit without any legitimate reason, which amounts to unlawful retention of money.

4. That your conduct is in violation of the terms of the rental agreement and applicable provisions of the Model Tenancy Act 2021 and/or applicable State Rent Control legislation.

5. Through this notice, you are hereby called upon to pay the security deposit amount of ₹${data.deposit_amount || '[AMOUNT]'}/- within 15 days from the date of receipt of this notice, i.e., on or before ${data.demand_date || '[DATE]'}.

6. Please take notice that in the event of failure on your part to comply with this demand within the stipulated time, my client shall be constrained to initiate appropriate legal proceedings against you before the competent Civil Court / Rent Authority and/or Police Authorities for recovery of the amount along with interest, costs, and damages — all at your risk and expense.

This notice is sent WITHOUT PREJUDICE to all rights and remedies available to my client.

Yours faithfully,

${data.sender_name || '[NAME]'}
(Authorized Signatory / Through Legal Representative)

---
NOTE: This is a draft legal notice template by NyayaSathi. 
For formal legal notices, please have a licensed advocate draft and send this on legal letterhead.
⚠️ This does not constitute legal advice.`;

    case 'affidavit':
      return `AFFIDAVIT

I, ${data.deponent_name || '[YOUR FULL NAME]'}, aged ${data.deponent_age || '[AGE]'} years, residing at ${data.deponent_address || '[YOUR ADDRESS]'}, do hereby solemnly affirm and declare as follows:

1. That I am the deponent herein and am fully competent to make this Affidavit.

2. That the facts stated herein are true and correct to the best of my knowledge, information and belief.

3. DECLARATION:
${data.statement || '[YOUR DECLARATION / STATEMENT]'}

4. That the contents of this Affidavit are true and correct to the best of my knowledge and belief. Nothing material has been concealed therefrom.

DEPONENT:

Verified at ${data.place || '[PLACE]'} on ${data.date || today}.

Verified that the contents of the above Affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.

DEPONENT: _________________
(${data.deponent_name || 'NAME'})

Attested before me:

NOTARY / OATH COMMISSIONER:
Name: _________________
Seal: _________________
Date: _________________

---
NOTE: This affidavit must be executed on stamp paper of appropriate value as per your state's Stamp Act, 
before a Notary Public or Oath Commissioner. 
This is a draft template by NyayaSathi and does not constitute legal advice.`;

    case 'rti-application':
      return `APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005

Date: ${today}

To,
The Public Information Officer,
${data.authority_name || '[PUBLIC AUTHORITY NAME]'}
[Address of the Authority]

Subject: Application for Information under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I, ${data.applicant_name || '[YOUR NAME]'}, residing at ${data.applicant_address || '[YOUR ADDRESS]'}, hereby request the following information under Section 6(1) of the Right to Information Act, 2005:

INFORMATION SOUGHT:
${data.information_sought || '[DESCRIBE THE INFORMATION YOU SEEK]'}

${data.period ? `Period of Information: ${data.period}` : ''}

I am enclosing the RTI application fee of ₹10/- by [Indian Postal Order / Demand Draft / Cash (if in person)].

If the information sought is not held by your office, kindly transfer this application to the concerned Public Information Officer under Section 6(3) of the RTI Act, 2005.

Thanking you,

Yours faithfully,

${data.applicant_name || '[YOUR NAME]'}
${data.applicant_address || '[YOUR ADDRESS]'}
Mobile: [YOUR MOBILE NUMBER]
Email: [YOUR EMAIL]

---
IMPORTANT NOTES:
• RTI Application Fee: ₹10 (BPL applicants are exempt — attach proof)
• Response time: 30 days (48 hours for life/liberty matters)
• First Appeal: to First Appellate Authority within 30 days of no/unsatisfactory response
• Second Appeal: to Central/State Information Commission
• Online RTI: https://rtionline.gov.in (for Central Government bodies)
• This template is by NyayaSathi and does not constitute legal advice.`;

    default:
      return 'Template not found.';
  }
}

function numberToWords(num: number): string {
  if (isNaN(num) || num === 0) return 'Zero';
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num < 20) return units[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + units[num % 10] : '');
  if (num < 1000) return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

function generateDocumentHTML(template: DocumentTemplate, data: Record<string, string>): string {
  const plainText = generateDocumentText(template, data);
  const escapedText = plainText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Convert text to HTML with proper paragraphs, sections, and formatting
  const htmlBody = escapedText
    .split('\n\n')
    .map((para) => {
      if (para.trim().startsWith('---')) return '';
      if (para.trim().match(/^[A-Z\s]+$/) && para.trim().length < 80) {
        return `<h2 style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 1px;">${para.trim()}</h2>`;
      }
      if (para.trim().match(/^\d+\.\s/)) {
        return `<p style="margin: 12px 0; line-height: 1.8;">${para.trim()}</p>`;
      }
      return `<p style="margin: 12px 0; line-height: 1.8;">${para.trim()}</p>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            font-family: 'Georgia', 'Palatino', serif;
            line-height: 1.8;
            color: #333;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .document-container {
            max-width: 8.5in;
            height: 11in;
            margin: 20px auto;
            padding: 1in;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            margin: 0 0 20px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #1a1a1a;
        }
        h2 {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
        }
        p {
            margin: 12px 0;
            text-align: justify;
            font-size: 13px;
        }
        .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
            width: 45%;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 12px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 11px;
            color: #666;
            text-align: center;
        }
        .disclaimer {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 4px;
            padding: 12px;
            margin: 15px 0;
            font-size: 12px;
            color: #856404;
        }
        .important-note {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            padding: 12px;
            margin: 15px 0;
            font-size: 11px;
            color: #721c24;
        }
        strong {
            font-weight: bold;
        }
        @media print {
            body {
                padding: 0;
                background: white;
            }
            .document-container {
                max-width: 100%;
                margin: 0;
                padding: 1in;
                box-shadow: none;
                height: auto;
            }
        }
    </style>
</head>
<body>
    <div class="document-container">
        ${htmlBody}
        <div class="footer">
            <p style="margin: 5px 0;">Generated by NyayaSathi • AI Legal Information Assistant</p>
            <p style="margin: 5px 0; font-size: 10px;">This is a draft template. Have a licensed advocate review before legal use.</p>
        </div>
    </div>
</body>
</html>`;
}
