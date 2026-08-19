import { JobOffer } from '../../utils/jobParser';

export interface ExternalJob {
  title: string;
  company: string;
  city: string;
  region: string;
  country: string;
  contract_type: string;
  experience_level: string;
  description: string;
  skills: string[];
  is_remote: boolean;
  source: 'Adzuna' | 'Jooble' | 'Glassdoor' | 'LinkedIn';
  source_url: string;
  salary?: string;
  company_rating?: number;
}

export type UnifiedJob = JobOffer & Partial<Omit<ExternalJob, keyof JobOffer>> & {
  source?: 'Adzuna' | 'Jooble' | 'Glassdoor' | 'LinkedIn' | 'ResumeFlow';
  source_url?: string;
  salary?: string;
  company_rating?: number;
};
