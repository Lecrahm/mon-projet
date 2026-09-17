import type { Channel, PowerDistance, Register } from "./types";

export function firstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function shouldVouvoyer(
  power: PowerDistance,
  register: Register,
  styleNotes: string,
): boolean {
  const notes = styleNotes.toLowerCase();
  if (/tutoi/.test(notes)) return false;
  if (/vouvoi/.test(notes)) return true;
  if (power === "public") return true;
  if (register === "corporate" && (power === "up" || power === "client")) return true;
  if (power === "client" && register !== "direct") return true;
  if (power === "up" && register === "diplomate") return true;
  return false;
}

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function capitalize(text: string): string {
  const t = text.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function ensurePeriod(text: string): string {
  const t = text.trim();
  if (!t) return t;
  if (/[.!?…]$/.test(t)) return t;
  return `${t}.`;
}

export function compress(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxChars - 1).trim()}…`;
}

export function greeting(args: {
  channel: Channel;
  name: string;
  vous: boolean;
  register: Register;
}): string | null {
  const first = firstName(args.name);
  if (args.channel === "sms") return null;
  if (args.channel === "slack") {
    if (!first) return null;
    return args.vous ? `Bonjour ${first},` : `${first} —`;
  }
  if (args.channel === "linkedin") {
    return args.vous || !first ? "Bonjour," : `Bonjour ${first},`;
  }
  if (first) return `Bonjour ${first},`;
  return "Bonjour,";
}

export function closing(args: {
  channel: Channel;
  vous: boolean;
  register: Register;
}): string | null {
  if (args.channel === "sms") return null;
  if (args.channel === "slack") return null;
  if (args.register === "corporate") {
    return args.vous ? "Cordialement," : "Bien à toi,";
  }
  if (args.register === "diplomate") {
    return args.vous ? "Merci d’avance," : "Merci d’avance,";
  }
  if (args.channel === "linkedin") return "Bien à vous,";
  return args.vous ? "Merci." : "Merci.";
}

export function wrapMessage(parts: {
  greet: string | null;
  body: string;
  close: string | null;
  channel: Channel;
}): string {
  const chunks: string[] = [];
  if (parts.greet && parts.channel !== "sms") chunks.push(parts.greet);
  chunks.push(parts.body.trim());
  if (parts.close && (parts.channel === "email" || parts.channel === "linkedin" || parts.channel === "other")) {
    chunks.push(parts.close);
  }
  if (parts.channel === "sms" || parts.channel === "slack") {
    return chunks.join(" ").replace(/\s+/g, " ").replace(" — ", " — ");
  }
  return chunks.join("\n\n");
}

export function preferShort(styleNotes: string): boolean {
  return /bref|court|concis|short|no blabla/i.test(styleNotes);
}
