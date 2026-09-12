/** Lettres et CV adaptés par offre. Sources originales absentes du repo : TODO à personnaliser. */

const HEADER = `Marcel ESMEL
Paris
TODO : e-mail · téléphone`;

function letter(objet: string, body: string): string {
  return `${HEADER}

Paris, le 12 septembre 2026

Objet : ${objet}

Madame, Monsieur,

${body}

Je reste à votre disposition pour un entretien.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Marcel ESMEL`;
}

function cv(label: string, accents: string[], extra = ""): string {
  return `CV ADAPTÉ — ${label}
================================
TODO : remplacer le bloc EXPÉRIENCE par le parcours réel de Marcel.

PROFIL
Hôte d'accueil / hospitality à Paris. Présence soignée, voix posée, goût du service
et de la discrétion. À l'aise en français et en anglais, dans des maisons où
l'accueil est déjà une promesse.

ACCENTS POUR CETTE OFFRE
${accents.map((line) => `• ${line}`).join("\n")}
${extra ? `\n${extra}\n` : ""}
COMPÉTENCES
• Accueil physique et téléphone, orientation, gestion des flux
• Posture luxe / corporate : discrétion, présentation, sens du détail
• Bilinguisme FR / EN (TODO : préciser le niveau réel)
• Outils : suite bureautique, badge / registre, messagerie

LANGUES
• Français — langue de travail
• Anglais — professionnel

MOBILITÉ
• Paris / intra-muros
• Pas de permis B

EXPÉRIENCE
TODO : coller ici les missions d'accueil, hôtellerie ou service de Marcel
(dates, maisons, responsabilités).`;
}

export const DOCUMENTS: Record<string, { letter: string; cv: string }> = {
  "seed-01": {
    letter: letter(
      "Candidature — Hospitality Officer H/F — PATCHWORK",
      `Le poste d'Hospitality Officer chez PATCHWORK, en QCA, correspond exactement à la manière dont je conçois l'accueil : un service fluide, corporatif, sans ostentation.

J'aime tenir un hall comme on tient une promesse — regard, rythme, discrétion. PATCHWORK m'intéresse pour le niveau d'exigence d'un immeuble premium et pour le rôle d'officer, plus large qu'un simple poste d'accueil : présence, coordination, hospitalité au quotidien.

Je candidate avec un CV calé sur ce registre hospitality / QCA. Je suis disponible rapidement pour un échange.`,
    ),
    cv: cv("PATCHWORK · Hospitality Officer", [
      "Hospitality de bureau premium / QCA, pas seulement un standard",
      "Tenue de hall, flux visiteurs, image de l'immeuble",
      "CDI, fourchette 24 715 – 28 546 EUR — priorité haute (fit 9.5)",
    ]),
  },
  "seed-02": {
    letter: letter(
      "[NE PAS ENVOYER] Candidature — Hôte / Hôtesse d'accueil — Cercle de l'Union Interalliée",
      `[BLOQUÉ] Cette offre du Cercle de l'Union Interalliée exige un permis de conduire. Marcel n'a pas le permis B. Ne pas envoyer cette lettre.

---

Le Cercle de l'Union Interalliée, rue du Faubourg Saint-Honoré, est l'une des maisons que j'aurais le plus aimé servir : club, membres, accueil de standing, CDI 35 h.

La lettre est prête si le critère permis était levé. En l'état, le dossier reste au hub à titre d'archive personnelle.`,
    ),
    cv: cv(
      "Cercle de l'Union Interalliée · Accueil (BLOQUÉ)",
      [
        "Club privé, membres, standing Faubourg Saint-Honoré",
        "CDI 35 h · 2 200 EUR/mois · 13 mois",
        "BLOQUÉ : permis B requis — Marcel n'a pas le permis",
      ],
      "NOTE INTERNE\nNe pas candidater tant que le permis n'est pas obtenu.",
    ),
  },
  "seed-03": {
    letter: letter(
      "[NE PAS ENVOYER] Candidature — Hôte Ensemble sportif — Cercle de l'Union Interalliée",
      `[BLOQUÉ] L'accueil de l'ensemble sportif du Cercle exige un permis de conduire. Marcel n'a pas le permis B. Ne pas envoyer cette lettre.

---

Le site sportif du Cercle (Paris 8e) m'attirait pour le contact membres, le rythme club et le CDI. Le dossier reste ici pour mémoire, pas pour envoi.`,
    ),
    cv: cv(
      "Cercle Interalliée · Ensemble sportif (BLOQUÉ)",
      [
        "Accueil club sportif, flux membres, énergie de maison",
        "CDI · 2 200 – 2 400 EUR/mois · 13 mois",
        "BLOQUÉ : permis B requis — Marcel n'a pas le permis",
      ],
      "NOTE INTERNE\nNe pas candidater tant que le permis n'est pas obtenu.",
    ),
  },
  "seed-04": {
    letter: letter(
      "Candidature — Hospitality Officer 35H — Groupe TDS",
      `Le poste d'Hospitality Officer 35 h chez Groupe TDS, à Paris 9e, m'intéresse pour son ancrage hospitality de site et pour un rythme de journée clair.

Je me vois tenir l'accueil d'un immeuble avec la même exigence qu'un hall d'hôtel discret : anticipation, calme, orientation des visiteurs, relais aux équipes.

Mon CV insiste sur le format officer 35 h plutôt que sur un accueil luxe « vitrine ». Je suis disponible pour vous rencontrer.`,
    ),
    cv: cv("Groupe TDS · Hospitality Officer 35H", [
      "Officer de site, 35 h, Paris 9e",
      "Hospitality opérationnelle plus que représentation mondaine",
      "Fourchette 1 925 – 2 075 EUR/mois",
    ]),
  },
  "seed-05": {
    letter: letter(
      "Candidature — Hôte Maison de Haute Joaillerie Place Vendôme — Florence Doré",
      `Une maison de haute joaillerie Place Vendôme demande autre chose qu'un accueil générique : silence, élégance, sécurité du geste, sens du seuil.

C'est précisément le registre que je cherche. Via Florence Doré, je candidate pour tenir la porte et le salon d'une maison où chaque visiteur est déjà un secret.

Le CV ci-joint met en avant discrétion, présentation et accueil de luxe. Je reste à votre disposition.`,
    ),
    cv: cv("Florence Doré · Haute joaillerie Vendôme", [
      "Luxe, Place Vendôme, seuil de maison — pas un open space",
      "Discrétion, présentation, sens du détail joaillier",
      "~2 250 EUR/mois · CDI · Paris 1er",
    ]),
  },
  "seed-06": {
    letter: letter(
      "Candidature — Hôte d'accueil bilingue Maison de luxe 8e — GR Welcome Services",
      `GR Welcome Services recrute un hôte bilingue pour une maison de luxe dans le 8e : c'est le cœur de mon shortlist — accueil, langues, standing.

Je peux tenir le français et l'anglais au même niveau de courtoisie, sans traduire le luxe en volume. La maison reste la maison ; je suis le seuil.

Salaire non communiqué : j'ouvre le dossier pour le poste, pas pour la fourchette. Je suis disponible pour un entretien.`,
    ),
    cv: cv("GR Welcome Services · Accueil bilingue luxe 8e", [
      "Bilinguisme FR / EN au premier plan",
      "Maison de luxe, Paris 8e, CDI",
      "Salaire NC — valoriser le standing plus que le chiffre",
    ]),
  },
  "seed-07": {
    letter: letter(
      "Candidature — Hôte Multisites Paris Intra-Muros — Florence Doré",
      `Le CDD multisites intra-muros chez Florence Doré m'intéresse pour l'agilité : plusieurs adresses, un même standard d'accueil.

Je suis à l'aise pour enchaîner les sites parisiens sans diluer la posture — chaque hall a son rythme, la maison reste la même exigence.

Le CV marque le format CDD / multisites et la rémunération (2 510 EUR/mois). Je peux démarrer selon vos plannings.`,
    ),
    cv: cv("Florence Doré · Multisites intra-muros (CDD)", [
      "Souplesse multisites, Paris intra-muros",
      "CDD temps plein · 2 510 EUR/mois",
      "Même standard d'accueil d'un site à l'autre",
    ]),
  },
  "seed-08": {
    letter: letter(
      "Candidature — Hôte d'accueil Cabinet d'avocats 8e — Florence Doré",
      `Un cabinet d'avocats dans le 8e n'est pas un hall d'hôtel : confidentialité, calme, lecture des urgences, représentation du cabinet dès la porte.

C'est ce registre que je propose. Via Florence Doré, je candidate pour un accueil juridique premium — clients, confrères, huissiers, silence.

Le CV met en avant discrétion et tenue de cabinet. Rémunération indiquée ~2 056 EUR. Je reste disponible.`,
    ),
    cv: cv("Florence Doré · Cabinet d'avocats 8e", [
      "Confidentialité, calme, représentation d'un cabinet",
      "Paris 8e · CDI · ~2 056 EUR",
      "Pas de posture « palace » : posture étude",
    ]),
  },
  "seed-09": {
    letter: letter(
      "Candidature — Hôte Cabinet Avocats Premium — Florence Doré",
      `Le cabinet d'avocats premium du 16e, proposé par Florence Doré, demande la même discipline que le 8e, avec une maison peut-être plus feutrée.

Je candidate pour tenir l'accueil : clients, associés, confidentialité, primes comprises dans la proposition (1 868 EUR + primes).

Mon CV est calé « étude premium / 16e ». Je peux vous rencontrer dès que vous le souhaitez.`,
    ),
    cv: cv("Florence Doré · Cabinet avocats premium 16e", [
      "Cabinet premium, Paris 16e, CDI 35 h",
      "1 868 EUR + primes — mentionner la part variable",
      "Même exigence de secret professionnel qu'en 8e",
    ]),
  },
  "seed-10": {
    letter: letter(
      "Candidature — ASAP Hôte Société Financière — Florence Doré",
      `L'offre ASAP pour une société financière dans le 16e (12 h – 20 h) m'intéresse pour le rythme de fin de journée et pour le standing finance.

Je peux tenir un accueil de société financière : badges, rendez-vous, discrétion sur les flux, ton posé. Florence Doré indique un besoin rapide : je suis disponible.

CV adapté « finance / ASAP / 16e ». Rémunération 1 868 EUR + primes.`,
    ),
    cv: cv("Florence Doré · Société financière ASAP 16e", [
      "ASAP, créneau 12 h – 20 h, société financière",
      "Paris 16e · CDI · 1 868 EUR + primes",
      "Discrétion des flux, badges, rendez-vous",
    ]),
  },
  "seed-11": {
    letter: letter(
      "Candidature — Hôte d'Accueil bilingue — Derichebourg Hospitality",
      `Derichebourg Hospitality, Paris 8e, CDI bilingue : un hospitality de site avec une vraie maison derrière le prestataire.

Je candidate pour l'accueil bilingue — français / anglais — dans un immeuble où le service est déjà un métier, pas un à-côté. La fourchette annuelle (22 405 – 23 662 EUR) est claire ; le poste l'est aussi.

Mon CV insiste sur le bilinguisme et le cadre hospitality. Je suis disponible pour un entretien.`,
    ),
    cv: cv("Derichebourg Hospitality · Accueil bilingue", [
      "Prestataire hospitality, Paris 8e, CDI",
      "Bilinguisme FR / EN au premier plan",
      "22 405 – 23 662 EUR / an",
    ]),
  },
  "seed-12": {
    letter: letter(
      "Candidature — Hôte(sse) Information Aéroportuaire — Otessa (CRIT) — Roissy CDG",
      `L'information aéroportuaire à Roissy CDG (Otessa / CRIT) est un autre métier d'accueil : flux, stress, clarté, langues, orientation.

Je candidate pour tenir le comptoir d'information — CDI ou CDD — avec calme et précision. Le salaire n'est pas communiqué ; le lieu et la mission le sont.

Le CV est adapté « aéroport / information voyageurs ». Je peux discuter des horaires et du contrat (CDI/CDD).`,
    ),
    cv: cv("Otessa (CRIT) · Information aéroportuaire CDG", [
      "Information voyageurs, Roissy CDG, flux et clarté",
      "CDI/CDD · salaire NC",
      "Orientation, langues, résistance au rythme aéroport",
    ]),
  },
};
