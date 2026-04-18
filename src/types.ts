export type Language = 'english' | 'hinglish';
export type MessageRole = 'user' | 'assistant';
export type FeedbackType = 'up' | 'down' | null;

export interface LawSection {
  act: string;
  section: string;
  title: string;
  excerpt: string;
  source: string;
  sourceUrl?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  lawSections?: LawSection[];
  nextSteps?: string[];
  helplines?: Helpline[];
  feedback?: FeedbackType;
  isSensitive?: boolean;
  documentType?: string;
}

export interface Helpline {
  name: string;
  number: string;
  description: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: TemplateField[];
  googleDocUrl?: string;
}

export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
}

export interface QuickScenario {
  id: string;
  label: string;
  hinglishLabel: string;
  query: string;
  icon: string;
  category: string;
}

export interface State {
  id: string;
  name: string;
  available: boolean;
}
