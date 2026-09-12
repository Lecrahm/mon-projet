import type { Status } from "./types";
import { STATUSES } from "./types";

export const STORAGE_KEY = "candidatures-tracker:marcel-esmel:v2";
export const OWNER = "Marcel ESMEL";
export const APP_NAME = "Hub";
export const TAGLINE = "Shortlist personnelle · Hospitality & accueil · Paris";

export const STATUS_META: Record<
  Status,
  { label: string; hint: string; accent: string }
> = {
  à_traiter: {
    label: "À traiter",
    hint: "Shortlist à étudier",
    accent: "rgba(255,255,255,0.92)",
  },
  adapté: {
    label: "Adapté",
    hint: "CV / lettre adaptés",
    accent: "rgba(186,230,253,0.95)",
  },
  candidaté: {
    label: "Candidaté",
    hint: "Candidature envoyée",
    accent: "rgba(167,243,208,0.95)",
  },
  relancé: {
    label: "Relancé",
    hint: "Relance effectuée",
    accent: "rgba(253,230,138,0.95)",
  },
  entretien: {
    label: "Entretien",
    hint: "Échange prévu ou passé",
    accent: "rgba(221,214,254,0.95)",
  },
  offre: {
    label: "Offre",
    hint: "Proposition reçue",
    accent: "rgba(134,239,172,0.95)",
  },
  refusé: {
    label: "Refusé",
    hint: "Réponse négative",
    accent: "rgba(252,165,165,0.92)",
  },
  archivé: {
    label: "Archivé",
    hint: "Mis de côté",
    accent: "rgba(212,212,216,0.75)",
  },
};

export const STATUS_LIST = STATUSES;
