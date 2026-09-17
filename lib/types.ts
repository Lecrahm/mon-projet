export type PowerDistance = "peer" | "up" | "client" | "public";
export type Channel = "email" | "slack" | "linkedin" | "sms" | "other";
export type Register = "direct" | "diplomate" | "corporate";
export type Outcome = "opened" | "won" | "clash";
export type FaceEngine = "openai" | "anthropic" | "mock";
export type Intent =
  | "demander"
  | "refuser"
  | "recadrer"
  | "feliciter"
  | "negocier"
  | "relancer"
  | "alerter";

export type Recipient = {
  id: string;
  name: string;
  role: string;
  powerDistance: PowerDistance;
  channelDefault: Channel;
  styleNotes: string;
  createdAt: string;
};

export type Ombre = {
  id: string;
  text: string;
  createdAt: string;
  tags: string[];
};

export type Face = {
  id: string;
  ombreId: string;
  recipientId: string;
  register: Register;
  channel: Channel;
  variant: "a" | "b";
  content: string;
  riskNote: string | null;
  dropped: string[];
  createdAt: string;
  copiedAt: string | null;
  sentMarkedAt: string | null;
  outcome: Outcome | null;
};

export type LutherShare = {
  id: string;
  sourceHash: string;
  rant: string;
  title: string;
  createdAt: string;
};

export type FaceApiSuccess = {
  ok: true;
  face_a: string;
  face_b: string;
  risk_note: string | null;
  dropped: string[];
  engine: FaceEngine;
  warning?: string;
};

export type SafetyBlock = {
  ok: false;
  code: "self_harm" | "violence" | "harassment" | "secrets" | "hate";
  message: string;
};

export type FaceApiResponse = FaceApiSuccess | SafetyBlock;

export type LutherApiSuccess = {
  ok: true;
  rant: string;
  title: string;
  engine: FaceEngine;
  warning?: string;
};

export type LutherApiResponse = LutherApiSuccess | SafetyBlock;

export type AppSnapshot = {
  version: 1;
  recipients: Recipient[];
  ombres: Ombre[];
  faces: Face[];
  lutherShares: LutherShare[];
  facesThisMonth: number;
  monthKey: string;
  lutherSharesToday: number;
  lutherDayKey: string;
  onboardingDone: boolean;
  demoUnlocked: boolean;
  paywallSeen: boolean;
};
