// Petit wrapper pour appeler linkedin-jobs-api depuis un projet ESM TypeScript
type RawJob = {
  position?: string;
  company?: string;
  location?: string;
  date?: string;
  agoTime?: string;
  salary?: string;
  jobUrl?: string;
  companyLogo?: string;
};

export type Job = {
  title: string;
  company: string;
  city: string;
  date?: string | null;
  salary?: string | null;
  url?: string | null;
  logo?: string | null;
  source: string;
};

export async function fetchLinkedinJobs(opts: { keyword?: string; location?: string; page?: number | string; limit?: number | string; host?: string; }) : Promise<Job[]> {
  const { keyword = '', location = '', page = 0, limit = 25, host } = opts;
  // import dynamique pour compat CommonJS
  const mod = await import('linkedin-jobs-api').catch(e => { throw e; });
  const linkedIn = (mod && (mod.default || mod));
  const queryOptions = {
    keyword,
    location,
    page: String(page),
    limit: String(limit),
    host: host || undefined,
  };
  const raw: RawJob[] = await linkedIn.query(queryOptions);
  const normalized = (raw || []).map(r => ({
    title: r.position || '',
    company: r.company || '',
    city: r.location || '',
    date: r.date || r.agoTime || null,
    salary: r.salary || null,
    url: r.jobUrl || null,
    logo: r.companyLogo || null,
    source: 'LinkedIn'
  }));
  return normalized;
}
