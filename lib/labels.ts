import type { Channel, Outcome, PowerDistance, Register } from "./types";

export const POWER_LABELS: Record<PowerDistance, string> = {
  peer: "Pair",
  up: "N+1 / hiérarchie",
  client: "Client",
  public: "Public",
};

export const CHANNEL_LABELS: Record<Channel, string> = {
  email: "Email",
  slack: "Slack",
  linkedin: "LinkedIn",
  sms: "SMS",
  other: "Autre",
};

export const REGISTER_LABELS: Record<Register, string> = {
  direct: "Direct",
  diplomate: "Diplomate",
  corporate: "Corporate FR",
};

export const REGISTER_HINTS: Record<Register, string> = {
  direct: "Clair, ferme, respectueux. Peu d’atténuateurs.",
  diplomate: "Reconnaît le cadre. Softens sans vider la demande.",
  corporate: "Vouvoiement si N+1/client. Problème → impact → demande.",
};

export const OUTCOME_LABELS: Record<Outcome, string> = {
  opened: "Ouvert",
  won: "Gagné",
  clash: "Clash",
};

export const POWER_HINTS: Record<PowerDistance, string> = {
  peer: "Collègue, même niveau.",
  up: "Manager, direction, comité.",
  client: "Compte, prospect, partenaire payeur.",
  public: "Audience large, post, liste.",
};
