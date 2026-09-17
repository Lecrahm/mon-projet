import { generateFace } from "@/lib/generate";
import type { Channel, PowerDistance, Register } from "@/lib/types";

export const runtime = "nodejs";

const REGISTERS: Register[] = ["direct", "diplomate", "corporate"];
const CHANNELS: Channel[] = ["email", "slack", "linkedin", "sms", "other"];
const POWERS: PowerDistance[] = ["peer", "up", "client", "public"];

function isRegister(value: unknown): value is Register {
  return typeof value === "string" && REGISTERS.includes(value as Register);
}
function isChannel(value: unknown): value is Channel {
  return typeof value === "string" && CHANNELS.includes(value as Channel);
}
function isPower(value: unknown): value is PowerDistance {
  return typeof value === "string" && POWERS.includes(value as PowerDistance);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, message: "Requête illisible." }, { status: 400 });
  }

  const ombreText = typeof body.ombreText === "string" ? body.ombreText : "";
  const register = body.register;
  const channel = body.channel;
  const recipient = (body.recipient ?? {}) as Record<string, unknown>;

  if (!isRegister(register) || !isChannel(channel)) {
    return Response.json({ ok: false, message: "Registre ou canal invalide." }, { status: 400 });
  }

  const result = await generateFace({
    ombreText,
    register,
    channel,
    recipient: {
      name: typeof recipient.name === "string" ? recipient.name : "",
      role: typeof recipient.role === "string" ? recipient.role : "",
      powerDistance: isPower(recipient.powerDistance) ? recipient.powerDistance : "peer",
      styleNotes: typeof recipient.styleNotes === "string" ? recipient.styleNotes : "",
    },
  });

  const status = result.ok ? 200 : result.code === "self_harm" ? 422 : 422;
  return Response.json(result, { status });
}
