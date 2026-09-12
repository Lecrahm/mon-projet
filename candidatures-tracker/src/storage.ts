import { STORAGE_KEY } from "./constants";
import { SEED_JOBS } from "./seed";
import { STATUSES, type Job, type Status } from "./types";

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeJob(raw: unknown): Job | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const title = asString(item.title).trim();
  const company = asString(item.company).trim();
  if (!title || !company) return null;

  const tags = Array.isArray(item.tags)
    ? item.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : [];

  const fit = Math.min(10, Math.max(1, asNumber(item.fit_score, 5)));

  return {
    id: asString(item.id) || crypto.randomUUID(),
    title,
    company,
    location: asString(item.location),
    contract: asString(item.contract),
    salary: asString(item.salary),
    url: asString(item.url),
    status: isStatus(item.status) ? item.status : "à_traiter",
    fit_score: Math.round(fit * 2) / 2,
    notes: asString(item.notes),
    date_found: asString(item.date_found),
    date_applied: asString(item.date_applied),
    next_followup: asString(item.next_followup),
    tags,
  };
}

export function parseJobsJson(text: string): Job[] {
  const parsed: unknown = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : [parsed];
  const jobs = list.map(normalizeJob).filter((job): job is Job => job !== null);
  if (jobs.length === 0) {
    throw new Error("Aucune candidature valide dans ce fichier.");
  }
  return jobs;
}

export function loadJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return structuredClone(SEED_JOBS);
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return structuredClone(SEED_JOBS);
    return parsed.map(normalizeJob).filter((job): job is Job => job !== null);
  } catch {
    return structuredClone(SEED_JOBS);
  }
}

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function exportJobsFile(jobs: Job[]): void {
  const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "candidatures-marcel-esmel.json";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
