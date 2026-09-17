import { mockFace } from "@/lib/mock-face";
import { mockLuther } from "@/lib/mock-luther";
import { classifySafety } from "@/lib/safety";
import type {
  Channel,
  FaceApiResponse,
  LutherApiResponse,
  PowerDistance,
  Register,
} from "@/lib/types";

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return null;
  return (await res.json()) as T;
}

export async function requestFace(input: {
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
  try {
    const data = await postJson<FaceApiResponse>("/api/face", input);
    if (data) return data;
  } catch {
    // local fallback
  }
  return {
    ok: true,
    engine: "mock",
    warning: "Moteur local — l’API n’a pas répondu en JSON.",
    ...mockFace(input),
  };
}

export async function requestLuther(text: string): Promise<LutherApiResponse> {
  const safety = classifySafety(text);
  if (!safety.ok) return safety;
  try {
    const data = await postJson<LutherApiResponse>("/api/luther", { text });
    if (data) return data;
  } catch {
    // local fallback
  }
  return {
    ok: true,
    engine: "mock",
    warning: "Moteur local — l’API n’a pas répondu en JSON.",
    ...mockLuther(text),
  };
}
