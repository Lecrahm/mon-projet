import { hashString } from "./ids";
import { stripDirectIdentifiers } from "./safety";
import { splitSentences, compress } from "./french";

const TITLES = [
  "Le café a trop parlé",
  "Version machine à café",
  "Colère en 4K",
  "Ce que je retiens pas",
  "Traduction non certifiée",
  "Mode Luther, hush",
  "Pas pour le N+1",
  "Le sous-texte en clair",
];

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length] as T;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function padRant(core: string, seed: number): string {
  const tails = [
    "Voilà. Vous pouvez renvoyer la version polie. Celle-là, c’est pour la machine à café, pas pour le fil Slack du N+1.",
    "Fin du sketch. Personne n’est doxxé, rien n’est envoyé. C’est juste le sous-texte qui a demandé le micro.",
    "Rideau. Si ça doit partir, ça passe d’abord en Face. Luther n’a pas de bouton Envoyer, et c’est très bien comme ça.",
    "On souffle. On ne publie pas ça sur le canal #general. On le montre à un ami, on rit, on écrit la Face.",
  ];
  const heads = [
    "OK. On va se parler franchement, version café trop serré.",
    "Très bien. On enlève le costume, on garde les faits, on monte le volume.",
    "Note de service interne, ton Luther, diffusion : personne.",
    "Allô la raison ? Non. Allô le spleen professionnel ? Oui, bonsoir.",
  ];
  let rant = `${pick(heads, seed)} ${core} ${pick(tails, seed + 3)}`.replace(/\s+/g, " ").trim();
  let guard = 0;
  while (countWords(rant) < 80 && guard < 4) {
    rant += " " + pick(tails, seed + guard + 7);
    guard += 1;
  }
  if (countWords(rant) > 160) {
    const words = rant.split(/\s+/).slice(0, 158);
    rant = `${words.join(" ")}.`;
  }
  return rant;
}

function exaggerate(text: string): string {
  return text
    .replace(/\bmerci de\b/gi, "ON PARLE D’UN MERCI DE")
    .replace(/\bje me permets\b/gi, "je me permets, donc je m’aplatis,")
    .replace(/\bsuite à notre échange\b/gi, "suite à notre échange (comprendre : mon monologue dans le vide)")
    .replace(/\bn['’]hésitez pas\b/gi, "n’hésitez pas — enfin si, hésitez, tout le monde hésite")
    .replace(/\bcordialement\b/gi, "cordialement, ce mot qui ment")
    .replace(/\bje reviens vers vous\b/gi, "je reviens vers vous, encore, toujours, mythologie de la relance");
}

export function mockLuther(source: string): { rant: string; title: string } {
  const stripped = stripDirectIdentifiers(source).text.trim();
  const seed = parseInt(hashString(stripped), 16);
  const sentences = splitSentences(stripped);
  const gist = compress(sentences.slice(0, 3).join(" "), 280);
  const core = exaggerate(
    gist
      ? `Donc voilà le fond, sans la cravate : ${gist} Et le corps, lui, a déjà écrit trois versions dans sa tête, toutes injugeables en open space.`
      : "Il y a une Ombre quelque part, et elle tape du pied. Rien de pénal, tout est professionnel, mais l’âme demande un solo de trombone.",
  );
  const title = pick(TITLES, seed);
  return {
    title,
    rant: padRant(core, seed),
  };
}
