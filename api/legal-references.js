const LEGAL_REFERENCES = [
  {
    id: 'tpa-lease',
    title: 'Transfer of Property Act, 1882',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/2185/1/A188202.pdf',
    keywords: ['rent', 'lease', 'tenant', 'landlord', 'evict', 'eviction', 'notice', 'rent agreement', 'property'],
    snippets: [
      'Section 105 defines a lease as a transfer of a right to enjoy immovable property for a certain time in consideration of a price or rent.',
      'Section 106 deals with notice to terminate certain leases in the absence of a contract or local law to the contrary.',
    ],
  },
  {
    id: 'registration-act',
    title: 'Registration Act, 1908',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/15228/1/registration_act%2C1908.pdf',
    keywords: ['rent agreement', 'lease deed', 'registration', '11 month', '11-month', 'stamp duty'],
    snippets: [
      'Section 17 generally requires registration of leases from year to year or for terms exceeding one year.',
    ],
  },
  {
    id: 'model-tenancy',
    title: 'Model Tenancy Act, 2021',
    source: 'Ministry of Housing and Urban Affairs',
    url: 'https://www.mohua.gov.in/upload/whatsnew/60b7acb90a086Model-Tenancy-Act-English-02.06.2021.pdf',
    keywords: ['tenant', 'landlord', 'security deposit', 'maintenance', 'repair', 'rent increase', 'rent agreement', 'eviction'],
    snippets: [
      'Section 11(2) says the security deposit should be refunded within one month after the tenant vacates, subject to valid deductions.',
      'Section 16 allocates repair and maintenance responsibilities between landlord and tenant.',
    ],
  },
  {
    id: 'consumer-protection',
    title: 'Consumer Protection Act, 2019',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/16939/1/a2019-35.pdf',
    keywords: ['consumer', 'defective product', 'refund', 'replacement', 'seller', 'company', 'service deficiency'],
    snippets: [
      'Section 35 provides for filing a consumer complaint before the District Commission.',
      'Section 34 deals with District Commission jurisdiction.',
    ],
  },
  {
    id: 'bnss-fir',
    title: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/20335/1/a2023-46.pdf',
    keywords: ['fir', 'police', 'complaint', 'cognizable', 'police refused', 'refused to file', 'register'],
    snippets: [
      'Section 173(1) says information relating to a cognizable offence may be given orally or electronically and shall be reduced to writing.',
      'Section 173(4) allows the informant to send the complaint to the Superintendent of Police if the officer in charge refuses to record it.',
    ],
  },
  {
    id: 'posh-act',
    title: 'Sexual Harassment of Women at Workplace Act, 2013',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/2104/1/A2013-14.pdf',
    keywords: ['posh', 'sexual harassment', 'workplace', 'office', 'internal committee', 'harassment at work'],
    snippets: [
      'Section 4 requires constitution of an Internal Committee in covered workplaces.',
      'Section 9 provides for a complaint of sexual harassment.',
      'Section 19 sets out duties of the employer.',
    ],
  },
  {
    id: 'it-act',
    title: 'Information Technology Act, 2000',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/1999/3/A200021.pdf',
    keywords: ['instagram', 'social media', 'online', 'post', 'platform', 'internet', 'content', 'intermediary', 'defamation'],
    snippets: [
      'Section 79 provides conditional safe-harbour protection to intermediaries for third-party information, subject to the statutory conditions.',
    ],
  },
  {
    id: 'bns-defamation',
    title: 'Bharatiya Nyaya Sanhita, 2023',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/20062/1/a2023-45.pdf',
    keywords: ['defamation', 'false accusation', 'reputation', 'instagram', 'online post', 'imputation'],
    snippets: [
      'Section 356 defines defamation and explains when an imputation harms a person’s reputation.',
    ],
  },
  {
    id: 'copyright-act',
    title: 'Copyright Act, 1957',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/15356/1/the_copyright_act%2C_1957.pdf',
    keywords: ['copyright', 'startup idea', 'pitch deck', 'business plan', 'code', 'design', 'shared idea'],
    snippets: [
      'Section 13 protects original literary, dramatic, musical and artistic works.',
      'Copyright generally protects original expression, not a bare idea by itself.',
    ],
  },
  {
    id: 'contract-act',
    title: 'Indian Contract Act, 1872',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/2187/2/A187209.pdf',
    keywords: ['contract', 'breach', 'nda', 'confidential', 'promise', 'startup idea', 'shared idea'],
    snippets: [
      'Section 73 deals with compensation for loss or damage caused by breach of contract.',
      'Section 75 deals with compensation when a person rightfully rescinds a contract.',
    ],
  },
];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function retrieveLegalReferences(query, selectedState = '') {
  const terms = new Set(tokenize(`${query} ${selectedState}`));

  const scored = LEGAL_REFERENCES.map((reference) => {
    const score = reference.keywords.reduce((sum, keyword) => {
      const keywordTerms = tokenize(keyword);
      const matches = keywordTerms.every((term) => terms.has(term));
      return sum + (matches ? Math.max(1, keywordTerms.length) : 0);
    }, 0);

    return { reference, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.reference);

  return scored;
}

export function formatReferenceContext(references) {
  if (!references?.length) return '';

  return references
    .map((reference, index) => {
      const snippetText = reference.snippets[0] || '';
      return `${index + 1}. ${reference.title} (${reference.source})\n${snippetText}\nURL: ${reference.url}`;
    })
    .join('\n\n');
}

export function formatReferenceSources(references) {
  if (!references?.length) return '';

  return [
    '## Sources to Verify',
    ...references.map((reference) => `- ${reference.title} (${reference.source}): ${reference.url}`),
  ].join('\n');
}
