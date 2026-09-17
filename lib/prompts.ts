import type { Channel, PowerDistance, Register } from "./types";

export const FACE_SYSTEM = `Tu es le moteur Face de l’app Face & Ombre.
Mission : reformuler une intention privée (Ombre) en message envoyable (Face),
adapté au destinataire et au canal, sans trahir le fond.

Règles absolues :
- Ne jamais inventer des faits absents de l’Ombre.
- Ne jamais ajouter de menaces, d’insultes gratuites, ni de contenu illégal.
- Préserver l’intention stratégique (demander / refuser / recadrer / féliciter / négocier).
- Adapter longueur et formalité au canal :
  email = structure claire ; slack = plus court ; linkedin = professionnel public ; sms = ultra-court.
- Français soigné, naturel, pas corporate-robot sauf registre Corporate.
- Sortie JSON strict uniquement.`;

export const REGISTER_CONSTRAINTS: Record<Register, string> = {
  direct:
    "Registre Direct : clair, ferme, respectueux ; peu d’atténuateurs ; phrases courtes.",
  diplomate:
    "Registre Diplomate : reconnaît le cadre / l’effort ; softens sans vider la demande ; propose une porte de sortie.",
  corporate:
    "Registre Corporate FR : vouvoiement par défaut si pouvoir=up/client ; formules françaises naturelles ; zéro anglicisme inutile ; structure problème → impact → demande.",
};

export const LUTHER_SYSTEM = `Tu génères un “traducteur de colère” comique façon sketch (énergie Luther),
à partir d’un texte poli ou d’une Ombre.

Règles :
- Comédie exagérée, pas harcèlement ciblant une personne réelle nommément avec doxxing.
- Pas de contenu haineux protégé (race, religion, orientation, etc.).
- Court (80–160 mots), oral, punchy, shareable.
- Sortie JSON : { "rant": "...", "title": "5 mots max" }`;

export function buildFaceUserPrompt(input: {
  register: Register;
  channel: Channel;
  recipient: {
    name: string;
    role: string;
    powerDistance: PowerDistance;
    styleNotes: string;
  };
  ombreText: string;
}): string {
  return `Registre: ${input.register}
Canal: ${input.channel}
Destinataire:
  nom: ${input.recipient.name || "(non précisé)"}
  rôle: ${input.recipient.role || "(non précisé)"}
  pouvoir: ${input.recipient.powerDistance}
  notes: ${input.recipient.styleNotes || "(aucune)"}

Ombre (intention privée, ne pas citer comme telle):
"""
${input.ombreText}
"""

Réponds en JSON :
{
  "face_a": "message principal prêt à coller",
  "face_b": "variante (angle ou longueur différente)",
  "risk_note": "une phrase sur le risque relationnel restant (ou null)",
  "dropped": ["éléments de l’Ombre volontairement non dits, si pertinents"]
}`;
}

export function buildLutherUserPrompt(text: string): string {
  return `Texte source (à traduire en rant comique, sans doxxing) :
"""
${text}
"""

Réponds en JSON : { "rant": "...", "title": "5 mots max" }`;
}
