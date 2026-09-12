import type { Job, JobFilters, Status } from "./types";

export function createEmptyJob(): Job {
  return {
    id: crypto.randomUUID(),
    title: "",
    company: "",
    location: "",
    contract: "CDI",
    salary: "",
    url: "",
    status: "à_traiter",
    fit_score: 8,
    notes: "",
    date_found: new Date().toISOString().slice(0, 10),
    date_applied: "",
    next_followup: "",
    tags: [],
    letter: "",
    cv: "",
    blocked: false,
    blocked_reason: "",
  };
}

export function formatFit(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function uniqueContracts(jobs: Job[]): string[] {
  return [...new Set(jobs.map((job) => job.contract).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}

export function matchesFilters(job: Job, filters: JobFilters): boolean {
  if (filters.status !== "all" && job.status !== filters.status) return false;
  if (filters.contract !== "all" && job.contract !== filters.contract) return false;
  if (job.fit_score < filters.minFit) return false;
  if (filters.blocked === "active" && job.blocked) return false;
  if (filters.blocked === "blocked" && !job.blocked) return false;

  const q = filters.query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    job.title,
    job.company,
    job.location,
    job.contract,
    job.salary,
    job.notes,
    job.letter,
    job.cv,
    job.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function countByStatus(jobs: Job[]): Record<Status, number> {
  return jobs.reduce(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    {
      à_traiter: 0,
      adapté: 0,
      candidaté: 0,
      relancé: 0,
      entretien: 0,
      offre: 0,
      refusé: 0,
      archivé: 0,
    } satisfies Record<Status, number>,
  );
}

export function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
