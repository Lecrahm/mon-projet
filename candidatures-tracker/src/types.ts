export const STATUSES = [
  "à_traiter",
  "adapté",
  "candidaté",
  "relancé",
  "entretien",
  "offre",
  "refusé",
  "archivé",
] as const;

export type Status = (typeof STATUSES)[number];

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  contract: string;
  salary: string;
  url: string;
  status: Status;
  fit_score: number;
  notes: string;
  date_found: string;
  date_applied: string;
  next_followup: string;
  tags: string[];
}

export interface JobFilters {
  query: string;
  status: Status | "all";
  contract: string;
  minFit: number;
}
