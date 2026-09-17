import { dayKey, isoWeekKey, monthKey } from "./ids";
import type { AppSnapshot, Face } from "./types";

export const STORAGE_KEY = "face-ombre.v0";

export const FREE_FACE_MONTHLY = 20;
export const FREE_RECIPIENTS = 3;
export const MAX_RECIPIENTS = 10;
export const FREE_LUTHER_DAILY = 3;
export const FREE_HISTORY_DAYS = 7;

export function emptySnapshot(): AppSnapshot {
  return {
    version: 1,
    recipients: [],
    ombres: [],
    faces: [],
    lutherShares: [],
    facesThisMonth: 0,
    monthKey: monthKey(),
    lutherSharesToday: 0,
    lutherDayKey: dayKey(),
    onboardingDone: false,
    demoUnlocked: false,
    paywallSeen: false,
  };
}

export function loadSnapshot(): AppSnapshot {
  if (typeof window === "undefined") return emptySnapshot();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySnapshot();
    const parsed = JSON.parse(raw) as Partial<AppSnapshot>;
    const base = emptySnapshot();
    const snapshot: AppSnapshot = {
      ...base,
      ...parsed,
      version: 1,
      recipients: parsed.recipients ?? [],
      ombres: parsed.ombres ?? [],
      faces: parsed.faces ?? [],
      lutherShares: parsed.lutherShares ?? [],
    };
    if (snapshot.monthKey !== monthKey()) {
      snapshot.monthKey = monthKey();
      snapshot.facesThisMonth = 0;
    }
    if (snapshot.lutherDayKey !== dayKey()) {
      snapshot.lutherDayKey = dayKey();
      snapshot.lutherSharesToday = 0;
    }
    return snapshot;
  } catch {
    return emptySnapshot();
  }
}

export function saveSnapshot(snapshot: AppSnapshot) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function facesThisWeek(faces: Face[]): number {
  const key = isoWeekKey();
  return faces.filter((face) => isoWeekKey(new Date(face.createdAt)) === key && face.variant === "a")
    .length;
}

export function isHistoryLocked(createdAt: string, demoUnlocked: boolean): boolean {
  if (demoUnlocked) return false;
  const created = new Date(createdAt).getTime();
  const cutoff = Date.now() - FREE_HISTORY_DAYS * 86400000;
  return created < cutoff;
}
