export type SectionType = "header" | "experience" | "education" | "skills" | "projects";

export interface CVSection {
  id: string;
  type: SectionType;
  content: Record<string, any>;
  style: Record<string, any>;
}

export type TemplateId =
  | 'moderne'
  | 'classique'
  | 'creatif'
  | 'minimal'
  | 'pro'
  | 'tech_lead'
  | 'nordic'
  | 'monochrome'
  | 'vibrant'
  | 'academic'
  | 'startup'
  | 'international'
  | 'luxure'
  | 'medical'
  | 'legal'
  | 'compact'
  | 'split_left'
  | 'elegant_serif'
  | 'bold_header'
  | 'modern_timeline';

export interface CVTheme {
  templateId: TemplateId;
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  spacingDensity: 'compact' | 'normal' | 'spacious';
}

export interface CVData {
  sections: CVSection[];
  theme?: CVTheme;
}

