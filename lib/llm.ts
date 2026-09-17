import { FACE_SYSTEM, LUTHER_SYSTEM, REGISTER_CONSTRAINTS, buildFaceUserPrompt, buildLutherUserPrompt } from "./prompts";
import type { Channel, FaceEngine, PowerDistance, Register } from "./types";

const TIMEOUT_MS = 20_000;

export function resolveEngine(): { engine: FaceEngine | null; model: string | null } {
  if (process.env.OPENAI_API_KEY) {
    return {
      engine: "openai",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      engine: "anthropic",
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
    };
  }
  return { engine: null, model: null };
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const payload = fenced?.[1] ?? trimmed;
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("JSON introuvable");
  }
  return JSON.parse(payload.slice(start, end + 1));
}

async function openaiJson(args: {
  system: string;
  user: string;
  model: string;
  temperature: number;
}): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: args.model,
        temperature: args.temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.user },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`OpenAI ${res.status}`);
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Réponse vide");
    return extractJson(content);
  } finally {
    clearTimeout(timer);
  }
}

async function anthropicJson(args: {
  system: string;
  user: string;
  model: string;
  temperature: number;
}): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: args.model,
        max_tokens: 1200,
        temperature: args.temperature,
        system: args.system,
        messages: [{ role: "user", content: args.user }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Anthropic ${res.status}`);
    }
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const content = data.content?.find((block) => block.type === "text")?.text;
    if (!content) throw new Error("Réponse vide");
    return extractJson(content);
  } finally {
    clearTimeout(timer);
  }
}

async function callOnce(args: {
  system: string;
  user: string;
  temperature: number;
}): Promise<{ engine: FaceEngine; json: unknown }> {
  const resolved = resolveEngine();
  if (!resolved.engine || !resolved.model) {
    throw new Error("no-llm");
  }
  const json =
    resolved.engine === "openai"
      ? await openaiJson({ ...args, model: resolved.model })
      : await anthropicJson({ ...args, model: resolved.model });
  return { engine: resolved.engine, json };
}

async function callWithRetry(args: {
  system: string;
  user: string;
  temperature: number;
}): Promise<{ engine: FaceEngine; json: unknown }> {
  try {
    return await callOnce(args);
  } catch {
    return await callOnce(args);
  }
}

export async function llmFace(input: {
  register: Register;
  channel: Channel;
  recipient: {
    name: string;
    role: string;
    powerDistance: PowerDistance;
    styleNotes: string;
  };
  ombreText: string;
}): Promise<{ engine: FaceEngine; json: unknown }> {
  return callWithRetry({
    system: `${FACE_SYSTEM}\n${REGISTER_CONSTRAINTS[input.register]}`,
    user: buildFaceUserPrompt(input),
    temperature: 0.25,
  });
}

export async function llmLuther(text: string): Promise<{ engine: FaceEngine; json: unknown }> {
  return callWithRetry({
    system: LUTHER_SYSTEM,
    user: buildLutherUserPrompt(text),
    temperature: 0.8,
  });
}
