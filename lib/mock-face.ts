import {
  capitalize,
  closing,
  compress,
  ensurePeriod,
  greeting,
  preferShort,
  shouldVouvoyer,
  splitSentences,
  wrapMessage,
} from "./french";
import { hashString } from "./ids";
import { stripDirectIdentifiers } from "./safety";
import type {
  Channel,
  Intent,
  PowerDistance,
  Register,
} from "./types";

type FaceInput = {
  ombreText: string;
  register: Register;
  channel: Channel;
  recipient: {
    name: string;
    role: string;
    powerDistance: PowerDistance;
    styleNotes: string;
  };
};

type Analysis = {
  intent: Intent;
  facts: string[];
  ask: string;
  dropped: string[];
  urgency: boolean;
  deadline: string | null;
  vous: boolean;
  short: boolean;
};

const SWEAR_DROPS: Array<[RegExp, string, string]> = [
  [/\bputain(?: de)?\b/gi, "", "jurons"],
  [/\bbordel(?: de)?\b/gi, "", "jurons"],
  [/\bmerde\b/gi, "problème", "jurons"],
  [/\b(connards?|cons?|enfoir[ée]s?|salauds?|salopes?)\b/gi, "", "insultes"],
  [/\bse fout(?:ent|e)? de ma gueule\b/gi, "ne prend pas le sujet au sérieux", "attaque personnelle"],
  [/\bs['’]en fout(?:ent|e)?\b/gi, "ne donne pas de suite", "attaque personnelle"],
  [/\bfout(?:re|ent|e)?\b/gi, "", "jurons"],
  [/\bgueule\b/gi, "", "registre trop cru"],
  [/\bnique(?:r)?\b/gi, "", "insultes"],
  [/\bchier\b/gi, "", "jurons"],
];

const EMOTION_PATTERNS: Array<[RegExp, string]> = [
  [/\bj['’]en ai marre\b/gi, "fatigue exprimée crûment"],
  [/\bje suis (vraiment )?(furieux|furieuse|épuis[ée]|à bout|dégout[ée]|dégouté)\b/gi, "émotion brute"],
  [/\bça me (saoule|gonfle|tue|rend fou|rend folle)\b/gi, "émotion brute"],
  [/\bje vais péter un câble\b/gi, "émotion brute"],
  [/\bil\/elle me saoule\b/gi, "attaque personnelle"],
];

function classifyIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/\b(bravo|f[ée]licitations?|super boulot|merci pour|beau travail)\b/.test(t)) {
    return "feliciter";
  }
  if (/\b(je refuse|pas d['’ ]accord|je ne (peux|veux) pas|c['’]est non)\b/.test(t)) {
    return "refuser";
  }
  if (/\b(trop cher|contre-propos|n[ée]goc|rabais|remise)\b/.test(t)) {
    return "negocier";
  }
  if (/\b(recadr|inacceptable|hors sujet|d[ée]passe(?:r)? les bornes|ce n['’]est plus possible)\b/.test(t)) {
    return "recadrer";
  }
  if (/\b(relance|ignor(?:e|ent)|pas de r[ée]ponse|sans retour|aucun retour|ghost)\b/.test(t)) {
    return "relancer";
  }
  if (/\b(on rate|risque de|urgent|en retard|deadline|dernier d[ée]lai)\b/.test(t)) {
    return "alerter";
  }
  return "demander";
}

function extractDeadline(text: string): string | null {
  const m = text.match(
    /\b(ce matin|cet apr[èe]s-midi|ce soir|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|fin de semaine|avant \w+|d['’]ici \w+|cette semaine|la semaine prochaine|\d+\s*(?:h|heures?|jours?|semaines?))\b/i,
  );
  return m?.[0] ?? null;
}

function cleanSentence(raw: string): { text: string; dropped: string[] } {
  const dropped: string[] = [];
  let text = raw.trim();
  for (const [pattern, replacement, label] of SWEAR_DROPS) {
    if (pattern.test(text)) {
      dropped.push(label);
      text = text.replace(pattern, replacement);
    }
  }
  for (const [pattern, label] of EMOTION_PATTERNS) {
    if (pattern.test(text)) {
      dropped.push(label);
      text = text.replace(pattern, "").trim();
    }
  }
  text = text
    .replace(/\s{2,}/g, " ")
    .replace(/^[,;:\s]+/, "")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
  return { text, dropped };
}

function isAsk(sentence: string): boolean {
  return /^(il faut|il faudrait|j['’]exige|je veux|je demande|peux[- ]tu|pouvez[- ]vous|merci de|valide|confirme)/i.test(
    sentence,
  ) || /[?]$/.test(sentence);
}

function isMostlyEmotion(sentence: string): boolean {
  return /^(j['’]en ai marre|je suis|ça me |il me |elle me )/i.test(sentence) &&
    !/\b(budget|mail|brief|deadline|sprint|client|dossier|go|validation)\b/i.test(sentence);
}

function analyze(input: FaceInput): Analysis {
  const stripped = stripDirectIdentifiers(input.ombreText);
  const dropped = [...stripped.dropped];
  const intent = classifyIntent(stripped.text);
  const deadline = extractDeadline(stripped.text);
  const urgency = /\b(urgent|rate|risque|asap|tout de suite|immédiat)\b/i.test(stripped.text);
  const vous = shouldVouvoyer(
    input.recipient.powerDistance,
    input.register,
    input.recipient.styleNotes,
  );
  const short = preferShort(input.recipient.styleNotes) || input.channel === "sms";

  const facts: string[] = [];
  let ask = "";

  for (const sentence of splitSentences(stripped.text)) {
    const cleaned = cleanSentence(sentence);
    dropped.push(...cleaned.dropped);
    if (!cleaned.text || cleaned.text.length < 3) continue;
    if (isMostlyEmotion(cleaned.text)) {
      dropped.push("émotion brute");
      continue;
    }
    if (isAsk(cleaned.text) || !ask) {
      if (isAsk(cleaned.text)) ask = cleaned.text;
      else if (!facts.includes(cleaned.text)) facts.push(cleaned.text);
    } else if (!facts.includes(cleaned.text)) {
      facts.push(cleaned.text);
    }
  }

  if (!ask) {
    ask = defaultAsk(intent, vous, deadline);
  } else {
    ask = rewriteAsk(ask, intent, vous, input.register);
  }

  const uniqueDropped = [...new Set(dropped.filter(Boolean))];
  return {
    intent,
    facts: facts.map((f) => ensurePeriod(capitalize(f))),
    ask: ensurePeriod(capitalize(ask)),
    dropped: uniqueDropped,
    urgency,
    deadline,
    vous,
    short,
  };
}

function defaultAsk(intent: Intent, vous: boolean, deadline: string | null): string {
  const peux = vous ? "Pouvez-vous" : "Peux-tu";
  const me = "me";
  const when = deadline ? ` ${deadline}` : "";
  switch (intent) {
    case "relancer":
      return `${peux} ${me} faire un retour${when} ?`;
    case "refuser":
      return vous
        ? "Je ne pourrai pas donner suite dans ces termes."
        : "Je ne pourrai pas dire oui dans ces termes.";
    case "recadrer":
      return "Il faut qu’on se remette d’accord sur le cadre.";
    case "feliciter":
      return "Je tenais à le dire clairement.";
    case "negocier":
      return `${peux} on en rediscuter${when} ?`;
    case "alerter":
      return `${peux} ${me} confirmer une décision${when} ?`;
    default:
      return `${peux} ${me} confirmer${when} ?`.replace("  ", " ");
  }
}

function rewriteAsk(ask: string, intent: Intent, vous: boolean, register: Register): string {
  let next = ask
    .replace(/\bil faut qu['’]elle\b/gi, vous ? "il faudrait qu’elle" : "il faut qu’elle")
    .replace(/\bil faut qu['’]il\b/gi, vous ? "il faudrait qu’il" : "il faut qu’il")
    .replace(/\bil faut que tu\b/gi, vous ? "pourriez-vous" : "peux-tu")
    .replace(/\bil faut que vous\b/gi, "pourriez-vous")
    .replace(/\bj['’]exige que tu\b/gi, vous ? "j’ai besoin que vous" : "j’ai besoin que tu")
    .replace(/\bje veux que tu\b/gi, vous ? "je vous demande de" : "je te demande de");

  if (register === "diplomate" && !/[?]$/.test(next) && intent !== "refuser" && intent !== "feliciter") {
    next = next.replace(/\.$/, " ?");
    if (!/[?]$/.test(next)) next = `${next.replace(/\.$/, "")} — qu’en dites-vous ?`;
  }
  return next;
}

function tuVousBody(text: string, vous: boolean): string {
  if (!vous) return text;
  return text
    .replace(/\b[Tt]u\b/g, "vous")
    .replace(/\bton\b/g, "votre")
    .replace(/\bta\b/g, "votre")
    .replace(/\btes\b/g, "vos")
    .replace(/\btoi\b/g, "vous")
    .replace(/\bTe\b/g, "Vous")
    .replace(/\bte\b/g, "vous");
}

function factsProse(facts: string[], register: Register): string {
  if (facts.length === 0) return "";
  if (register === "direct") return facts.join(" ");
  if (facts.length === 1) return facts[0];
  const head = facts[0];
  const tail = facts.slice(1).join(" ");
  if (register === "corporate") {
    return `${head} ${tail}`.trim();
  }
  return `${head} ${tail}`.trim();
}

function buildBodyA(analysis: Analysis, register: Register, channel: Channel, role: string): string {
  const facts = factsProse(analysis.facts, register);
  const roleBit = role && register !== "direct" ? "" : "";
  void roleBit;
  const ask = analysis.ask;
  const door = analysis.vous
    ? "Si le moment est mauvais, dites-moi un créneau."
    : "Si le timing est mauvais, dis-moi un créneau.";

  if (register === "direct") {
    const core = [facts, ask].filter(Boolean).join(" ");
    return tuVousBody(core, analysis.vous);
  }

  if (register === "diplomate") {
    const open = analysis.vous
      ? "Je me permets de revenir vers vous."
      : "Je me permets de revenir vers toi.";
    const acknowledge = analysis.intent === "relancer"
      ? analysis.vous
        ? "Je sais que vous êtes sollicité·e."
        : "Je sais que tu es sollicité·e."
      : analysis.vous
        ? "Je tiens compte du contexte."
        : "Je tiens compte du contexte.";
    const core = [open, acknowledge, facts, ask, door].filter(Boolean).join(" ");
    return tuVousBody(core, analysis.vous);
  }

  const problem = facts || "Un point reste ouvert de notre côté.";
  const impact = analysis.urgency || analysis.deadline
    ? analysis.deadline
      ? `Sans décision ${analysis.deadline}, l’impact opérationnel devient réel.`
      : "Sans décision, l’impact opérationnel devient réel."
    : "Je souhaite sécuriser la suite.";
  const demande = ask;
  const core = [problem, impact, demande].join(" ");
  return tuVousBody(core, true && analysis.vous ? true : analysis.vous);
}

function buildBodyB(
  analysis: Analysis,
  register: Register,
  channel: Channel,
  bodyA: string,
  seed: number,
): string {
  const askFirst = analysis.ask;
  const fact = analysis.facts[0] ?? "";
  if (channel === "sms" || analysis.short) {
    return tuVousBody(compress(`${askFirst} ${fact}`.trim(), 160), analysis.vous);
  }
  if (channel === "linkedin") {
    const publicSafe = tuVousBody(
      [askFirst, "Je reste disponible pour en parler par message."].join(" "),
      analysis.vous,
    );
    return publicSafe;
  }
  if (channel === "slack") {
    const extra = fact ? `${askFirst} Contexte : ${fact}` : askFirst;
    return tuVousBody(extra, analysis.vous);
  }
  if (seed % 2 === 0) {
    return tuVousBody(
      compress([askFirst, fact].filter(Boolean).join(" "), channel === "email" ? 280 : 200),
      analysis.vous,
    );
  }
  if (register === "corporate") {
    return tuVousBody(
      `Objet du message : ${askFirst} ${fact}`.trim(),
      analysis.vous,
    );
  }
  return bodyA;
}

function lengthForChannel(channel: Channel, short: boolean): number {
  if (channel === "sms") return 180;
  if (channel === "slack") return short ? 220 : 320;
  if (channel === "linkedin") return 420;
  if (short) return 380;
  return 1200;
}

function riskNote(input: FaceInput, analysis: Analysis): string | null {
  if (input.register === "direct" && (input.recipient.powerDistance === "up" || input.recipient.powerDistance === "client")) {
    return "Le ton reste sec pour ce destinataire : relisez une fois à froid avant d’envoyer.";
  }
  if (analysis.dropped.includes("insultes") || analysis.dropped.includes("attaque personnelle")) {
    return "La frustration a été filtrée ; le fond est conservé.";
  }
  if (analysis.urgency && input.register === "direct") {
    return "Le délai annoncé peut mettre la pression — c’est volontaire.";
  }
  if (input.register === "diplomate") {
    return "Le message reste ferme sur le fond, plus doux sur la forme.";
  }
  if (input.channel === "linkedin") {
    return "Version publique : le détail interne a été allégé.";
  }
  return null;
}

export function mockFace(input: FaceInput): {
  face_a: string;
  face_b: string;
  risk_note: string | null;
  dropped: string[];
} {
  const analysis = analyze(input);
  const greet = greeting({
    channel: input.channel,
    name: input.recipient.name,
    vous: analysis.vous,
    register: input.register,
  });
  const close = closing({
    channel: input.channel,
    vous: analysis.vous,
    register: input.register,
  });

  const rawA = buildBodyA(analysis, input.register, input.channel, input.recipient.role);
  const max = lengthForChannel(input.channel, analysis.short);
  const bodyA = compress(rawA, max);
  const seed = parseInt(hashString(input.ombreText + input.register + input.channel), 16);
  const rawB = buildBodyB(analysis, input.register, input.channel, bodyA, seed);
  const bodyB = compress(rawB, Math.min(max, input.channel === "email" ? 360 : max));

  const faceA = wrapMessage({
    greet,
    body: bodyA,
    close,
    channel: input.channel,
  });

  const greetB = input.channel === "email" ? greet : greeting({
    channel: input.channel,
    name: input.recipient.name,
    vous: analysis.vous,
    register: input.register === "corporate" ? "direct" : input.register,
  });

  const faceB = wrapMessage({
    greet: input.channel === "sms" ? null : greetB,
    body: bodyB,
    close: input.channel === "email" ? (analysis.vous ? "Merci." : "Merci.") : null,
    channel: input.channel,
  });

  const dropped = analysis.dropped.filter((d, i, arr) => arr.indexOf(d) === i);
  if (input.channel === "linkedin" && analysis.facts.length > 1) {
    dropped.push("détails internes trop précis pour un canal public");
  }

  return {
    face_a: faceA.trim(),
    face_b: faceB.trim() === faceA.trim()
      ? wrapMessage({
          greet: input.channel === "sms" ? null : greet,
          body: compress(analysis.ask, 200),
          close: input.channel === "email" ? "Merci." : null,
          channel: input.channel,
        })
      : faceB.trim(),
    risk_note: riskNote(input, analysis),
    dropped,
  };
}
