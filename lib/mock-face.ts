import {
  closing,
  compress,
  greeting,
  preferShort,
  shouldVouvoyer,
  wrapMessage,
} from "./french";
import { hashString } from "./ids";
import { stripDirectIdentifiers } from "./safety";
import type { Channel, Intent, PowerDistance, Register } from "./types";

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
  topic: string;
  since: string | null;
  deadline: string | null;
  impact: string | null;
  dropped: string[];
  urgency: boolean;
  vous: boolean;
  short: boolean;
};

const TOPICS: Array<[RegExp, string]> = [
  [/\bbriefs?\b/i, "le brief"],
  [/\bbudgets?\b/i, "le budget"],
  [/\bsprints?\b/i, "le sprint"],
  [/\bdossiers?\b/i, "le dossier"],
  [/\bcontrats?\b/i, "le contrat"],
  [/\bdevis\b/i, "le devis"],
  [/\brecettes?\b/i, "la recette"],
  [/\bplanning\b/i, "le planning"],
  [/\bgo\b/i, "le go"],
  [/\bvalidations?\b/i, "la validation"],
  [/\brelances?\b/i, "les relances"],
  [/\bmails?|e-?mails?|messages?\b/i, "les échanges"],
];

function classifyIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/\b(bravo|f[ée]licitations?|super boulot|merci pour|beau travail)\b/.test(t)) return "feliciter";
  if (/\b(je refuse|pas d['’ ]accord|je ne (peux|veux) pas|c['’]est non)\b/.test(t)) return "refuser";
  if (/\b(trop cher|contre-propos|n[ée]goc|rabais|remise)\b/.test(t)) return "negocier";
  if (/\b(recadr|inacceptable|hors sujet|d[ée]passe(?:r)? les bornes|ce n['’]est plus possible)\b/.test(t)) {
    return "recadrer";
  }
  if (/\b(relance|ignor(?:e|ent)|pas de r[ée]ponse|sans retour|aucun retour|ghost|depuis)\b/.test(t)) {
    return "relancer";
  }
  if (/\b(on rate|risque de|urgent|en retard|deadline|dernier d[ée]lai)\b/.test(t)) return "alerter";
  return "demander";
}

function extractTopic(text: string): string {
  for (const [pattern, label] of TOPICS) {
    if (pattern.test(text)) return label;
  }
  return "ce point";
}

function extractDeadline(text: string): string | null {
  const named = text.match(
    /\b(ce matin|cet apr[èe]s-midi|ce soir|demain|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|fin de semaine|cette semaine|la semaine prochaine)\b/i,
  );
  if (named) return named[0].toLowerCase();
  const until = text.match(/\b(?:avant|d['’]ici|pour)\s+(le\s+)?(\w+)/i);
  if (until) return until[0].toLowerCase();
  return null;
}

function extractSince(text: string): string | null {
  const m = text.match(/\bdepuis\s+(\d+\s*(?:jours?|semaines?|mois|heures?))/i);
  return m?.[1]?.toLowerCase() ?? null;
}

function extractImpact(text: string): string | null {
  if (/\bon rate le sprint\b/i.test(text)) return "le sprint bascule";
  if (/\bon rate le trimestre\b/i.test(text)) return "le trimestre est en risque";
  if (/\bon rate\b/i.test(text)) return "l’engagement n’est plus tenable";
  if (/\ben retard\b/i.test(text)) return "le planning glisse";
  if (/\brisque\b/i.test(text)) return "l’impact opérationnel devient réel";
  return null;
}

function collectDropped(text: string): string[] {
  const dropped: string[] = [];
  const t = text.toLowerCase();
  if (/putain|bordel|merde|foutre?|gueule|chier/.test(t)) dropped.push("jurons");
  if (/connard|enfoir|salaud|salope|\bcons?\b/.test(t)) dropped.push("insultes");
  if (/s['’ ]?en fout|fout de ma gueule|se fiche de/.test(t)) dropped.push("attaque personnelle");
  if (/j['’ ]?en ai marre|furieux|à bout|saoule|péter un câble/.test(t)) dropped.push("émotion brute");
  return [...new Set(dropped)];
}

function analyze(input: FaceInput): Analysis {
  const stripped = stripDirectIdentifiers(input.ombreText);
  const dropped = [...stripped.dropped, ...collectDropped(stripped.text)];
  return {
    intent: classifyIntent(stripped.text),
    topic: extractTopic(stripped.text),
    since: extractSince(stripped.text),
    deadline: extractDeadline(stripped.text),
    impact: extractImpact(stripped.text),
    dropped: [...new Set(dropped.filter(Boolean))],
    urgency: /\b(urgent|rate|risque|asap|immédiat)\b/i.test(stripped.text),
    vous: shouldVouvoyer(
      input.recipient.powerDistance,
      input.register,
      input.recipient.styleNotes,
    ),
    short: preferShort(input.recipient.styleNotes) || input.channel === "sms",
  };
}

function factLine(analysis: Analysis): string {
  if (analysis.since) return `Pas de retour sur ${analysis.topic} depuis ${analysis.since}.`;
  return `Sujet : ${analysis.topic}.`;
}

function askPhrase(analysis: Analysis): string {
  const when = analysis.deadline ? ` d’ici ${analysis.deadline}` : "";
  if (analysis.vous) {
    switch (analysis.intent) {
      case "relancer":
        return `Pourriez-vous me faire un retour${when} ?`;
      case "refuser":
        return "Je ne pourrai pas donner suite dans ces termes.";
      case "recadrer":
        return "Il faudrait qu’on se remette d’accord sur le cadre.";
      case "feliciter":
        return "Je tenais à vous le dire clairement.";
      case "negocier":
        return `Pourrions-nous en rediscuter${when} ?`;
      default:
        return `Pourriez-vous me confirmer${when} ?`;
    }
  }
  switch (analysis.intent) {
    case "relancer":
      return `Peux-tu me faire un retour${when} ?`;
    case "refuser":
      return "Je ne pourrai pas dire oui dans ces termes.";
    case "recadrer":
      return "Il faut qu’on se remette d’accord sur le cadre.";
    case "feliciter":
      return "Je tenais à te le dire clairement.";
    case "negocier":
      return `On en rediscute${when} ?`;
    default:
      return `Peux-tu me confirmer${when} ?`;
  }
}

function impactLine(analysis: Analysis): string | null {
  if (!analysis.impact) return null;
  if (analysis.deadline) return `Sans décision ${analysis.deadline}, ${analysis.impact}.`;
  return `Sans décision, ${analysis.impact}.`;
}

function buildBodyA(analysis: Analysis, register: Register): string {
  const ask = askPhrase(analysis);
  const facts = factLine(analysis);
  const impact = impactLine(analysis);
  const door = analysis.vous
    ? "Si le moment est mauvais, dites-moi un créneau."
    : "Si le timing est mauvais, dis-moi un créneau.";

  if (register === "direct") {
    return [facts, impact, ask].filter(Boolean).join(" ");
  }
  if (register === "diplomate") {
    const open = analysis.vous
      ? "Je me permets de revenir vers vous. Je sais que vous êtes sollicité·e."
      : "Je me permets de revenir vers toi. Je sais que tu es sollicité·e.";
    return [open, facts, impact, ask, door].filter(Boolean).join(" ");
  }
  const impactOrSafe = impact ?? "Je souhaite sécuriser la suite.";
  return [facts, impactOrSafe, ask].filter(Boolean).join(" ");
}

function buildBodyB(analysis: Analysis, channel: Channel, seed: number): string {
  const ask = askPhrase(analysis);
  const impact = impactLine(analysis);
  if (channel === "sms" || analysis.short) {
    return [ask, impact].filter(Boolean).join(" ");
  }
  if (channel === "linkedin") {
    return `${ask} Je reste disponible pour en parler par message.`;
  }
  if (channel === "slack") {
    return [ask, factLine(analysis)].join(" ");
  }
  if (seed % 2 === 0) {
    return [ask, impact ?? factLine(analysis)].filter(Boolean).join(" ");
  }
  return `Objet : ${analysis.topic}. ${ask}`;
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
  const max = lengthForChannel(input.channel, analysis.short);
  const seed = parseInt(hashString(input.ombreText + input.register + input.channel), 16);
  const bodyA = compress(buildBodyA(analysis, input.register), max);
  const bodyB = compress(buildBodyB(analysis, input.channel, seed), Math.min(max, input.channel === "email" ? 360 : max));

  const dropped = [...analysis.dropped];
  if (input.channel === "linkedin") {
    dropped.push("détails internes trop précis pour un canal public");
  }

  return {
    face_a: wrapMessage({ greet, body: bodyA, close, channel: input.channel }).trim(),
    face_b: wrapMessage({
      greet: input.channel === "sms" ? null : greet,
      body: bodyB,
      close: input.channel === "email" ? "Merci." : null,
      channel: input.channel,
    }).trim(),
    risk_note: riskNote(input, analysis),
    dropped: [...new Set(dropped)],
  };
}
