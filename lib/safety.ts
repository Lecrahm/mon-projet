import type { SafetyBlock } from "./types";

type Rule = {
  code: SafetyBlock["code"];
  pattern: RegExp;
  message: string;
};

const RULES: Rule[] = [
  {
    code: "self_harm",
    pattern:
      /\b(suicider?|me tuer|me suicider|en finir avec la vie|me pendre|me défenestr)/i,
    message:
      "Ce texte touche à une détresse trop réelle pour Face ou Luther. Si vous êtes en danger, appelez le 3114 (France) ou les secours. On n’en fait pas un message.",
  },
  {
    code: "violence",
    pattern:
      /\b(je vais (le|la|les) (tuer|frapper|tabasser|égorger)|bombe|tuerie|menace de mort)\b/i,
    message:
      "On ne reformule pas une menace ou une violence réelle. Gardez la frustration pro ; laissez tomber le passage à l’acte.",
  },
  {
    code: "harassment",
    pattern:
      /\b(doxx|doxing|adresse personnelle|num[ée]ro de s[ée]cu|harc[eè]le[rz]?-?(le|la|les)?)\b/i,
    message:
      "Pas de doxxing ni de harcèlement ciblé. Luther est un sketch, pas une arme.",
  },
  {
    code: "secrets",
    pattern:
      /\b(mot de passe\s*[:=]|password\s*[:=]|api[_-]?key\s*[:=]|num[ée]ro de carte|secret[ée] m[ée]dical d’autrui)\b/i,
    message:
      "Ce texte ressemble à un secret d’autrui ou à un identifiant. On ne le fait pas circuler, même reformulé.",
  },
  {
    code: "hate",
    pattern:
      /\b(sale (race|juif|arabe|noir|pédé|pd|goudou|musulman|rom)|n[iï]gre|youpin|bougnoule)\b/i,
    message:
      "Pas de contenu haineux visant une personne ou un groupe protégé. La colère pro, oui. Ça, non.",
  },
];

export function classifySafety(text: string): { ok: true } | SafetyBlock {
  const sample = text.trim();
  if (!sample) {
    return {
      ok: false,
      code: "harassment",
      message: "Écrivez d’abord une Ombre — même deux phrases suffisent.",
    };
  }
  for (const rule of RULES) {
    if (rule.pattern.test(sample)) {
      return { ok: false, code: rule.code, message: rule.message };
    }
  }
  return { ok: true };
}

export function stripDirectIdentifiers(text: string): {
  text: string;
  dropped: string[];
} {
  const dropped: string[] = [];
  let next = text;
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  if (email.test(next)) {
    dropped.push("adresses email");
    next = next.replace(email, "[email]");
  }
  const phone = /(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}/g;
  if (phone.test(next)) {
    dropped.push("numéros de téléphone");
    next = next.replace(phone, "[tel]");
  }
  return { text: next, dropped };
}
