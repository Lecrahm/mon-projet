import { mockFace } from "./mock-face";
import { mockLuther } from "./mock-luther";
import { llmFace, llmLuther, resolveEngine } from "./llm";
import { classifySafety } from "./safety";
import type {
  Channel,
  FaceApiResponse,
  LutherApiResponse,
  PowerDistance,
  Register,
} from "./types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function parseFace(json: unknown): {
  face_a: string;
  face_b: string;
  risk_note: string | null;
  dropped: string[];
} | null {
  if (!json || typeof json !== "object") return null;
  const record = json as Record<string, unknown>;
  const face_a = asString(record.face_a);
  const face_b = asString(record.face_b);
  if (!face_a || !face_b) return null;
  const riskRaw = record.risk_note;
  const risk_note =
    riskRaw === null || riskRaw === "null" || riskRaw === ""
      ? null
      : asString(riskRaw) || null;
  return {
    face_a,
    face_b,
    risk_note,
    dropped: asStringArray(record.dropped),
  };
}

function parseLuther(json: unknown): { rant: string; title: string } | null {
  if (!json || typeof json !== "object") return null;
  const record = json as Record<string, unknown>;
  const rant = asString(record.rant);
  const title = asString(record.title);
  if (!rant || !title) return null;
  const words = title.split(/\s+/).filter(Boolean);
  return {
    rant,
    title: words.slice(0, 5).join(" "),
  };
}

export async function generateFace(input: {
  ombreText: string;
  register: Register;
  channel: Channel;
  recipient: {
    name: string;
    role: string;
    powerDistance: PowerDistance;
    styleNotes: string;
  };
}): Promise<FaceApiResponse> {
  const safety = classifySafety(input.ombreText);
  if (!safety.ok) return safety;

  const fallback = mockFace(input);
  if (!resolveEngine().engine) {
    return { ok: true, engine: "mock", ...fallback };
  }

  try {
    const { engine, json } = await llmFace(input);
    const parsed = parseFace(json);
    if (parsed) return { ok: true, engine, ...parsed };
    return {
      ok: true,
      engine: "mock",
      warning: "Le modèle a renvoyé un format inattendu. Version locale.",
      ...fallback,
    };
  } catch {
    return {
      ok: true,
      engine: "mock",
      warning: "Le modèle n’a pas répondu à temps. Version locale.",
      ...fallback,
    };
  }
}

export async function generateLuther(text: string): Promise<LutherApiResponse> {
  const safety = classifySafety(text);
  if (!safety.ok) return safety;

  const fallback = mockLuther(text);
  if (!resolveEngine().engine) {
    return { ok: true, engine: "mock", ...fallback };
  }

  try {
    const { engine, json } = await llmLuther(text);
    const parsed = parseLuther(json);
    if (parsed) return { ok: true, engine, ...parsed };
    return {
      ok: true,
      engine: "mock",
      warning: "Le modèle a renvoyé un format inattendu. Version locale.",
      ...fallback,
    };
  } catch {
    return {
      ok: true,
      engine: "mock",
      warning: "Le modèle n’a pas répondu à temps. Version locale.",
      ...fallback,
    };
  }
}
