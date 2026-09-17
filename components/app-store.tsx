"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { uid } from "@/lib/ids";
import {
  FREE_RECIPIENTS,
  MAX_RECIPIENTS,
  emptySnapshot,
  facesThisWeek,
  loadSnapshot,
  saveSnapshot,
} from "@/lib/storage";
import type {
  AppSnapshot,
  Channel,
  Face,
  LutherShare,
  Ombre,
  Outcome,
  Recipient,
  Register,
} from "@/lib/types";

type RecipientDraft = Omit<Recipient, "id" | "createdAt">;

type Store = {
  ready: boolean;
  snapshot: AppSnapshot;
  weekFaces: number;
  addRecipient: (draft: RecipientDraft) => { ok: true; recipient: Recipient } | { ok: false; reason: "max" | "paywall" };
  updateRecipient: (id: string, draft: Partial<RecipientDraft>) => void;
  deleteRecipient: (id: string) => void;
  recordGeneration: (input: {
    ombreText: string;
    recipientId: string;
    register: Register;
    channel: Channel;
    faceA: string;
    faceB: string;
    riskNote: string | null;
    dropped: string[];
  }) => { ombre: Ombre; faces: Face[] };
  markCopied: (faceId: string) => void;
  markSent: (faceId: string) => void;
  setOutcome: (faceId: string, outcome: Outcome | null) => void;
  addLutherShare: (share: Omit<LutherShare, "id" | "createdAt">) => LutherShare;
  completeOnboarding: () => void;
  unlockDemo: () => void;
  markPaywallSeen: () => void;
  wipe: () => void;
  exportJson: () => string;
};

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(emptySnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSnapshot(loadSnapshot());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveSnapshot(snapshot);
  }, [ready, snapshot]);

  const value = useMemo<Store>(() => {
    const mutate = (fn: (current: AppSnapshot) => AppSnapshot) => {
      setSnapshot((current) => fn(current));
    };
    return {
      ready,
      snapshot,
      weekFaces: facesThisWeek(snapshot.faces),
      addRecipient: (draft) => {
        if (snapshot.recipients.length >= MAX_RECIPIENTS) {
          return { ok: false, reason: "max" };
        }
        if (!snapshot.demoUnlocked && snapshot.recipients.length >= FREE_RECIPIENTS) {
          return { ok: false, reason: "paywall" };
        }
        const recipient: Recipient = {
          ...draft,
          id: uid("rcp"),
          createdAt: new Date().toISOString(),
        };
        mutate((current) => ({
          ...current,
          recipients: [...current.recipients, recipient],
        }));
        return { ok: true, recipient };
      },
      updateRecipient: (id, draft) => {
        mutate((current) => ({
          ...current,
          recipients: current.recipients.map((item) =>
            item.id === id ? { ...item, ...draft } : item,
          ),
        }));
      },
      deleteRecipient: (id) => {
        mutate((current) => ({
          ...current,
          recipients: current.recipients.filter((item) => item.id !== id),
        }));
      },
      recordGeneration: (input) => {
        const ombre: Ombre = {
          id: uid("omb"),
          text: input.ombreText,
          createdAt: new Date().toISOString(),
          tags: [],
        };
        const shared = {
          ombreId: ombre.id,
          recipientId: input.recipientId,
          register: input.register,
          channel: input.channel,
          riskNote: input.riskNote,
          dropped: input.dropped,
          createdAt: new Date().toISOString(),
          copiedAt: null,
          sentMarkedAt: null,
          outcome: null,
        };
        const faceA: Face = {
          ...shared,
          id: uid("face"),
          variant: "a",
          content: input.faceA,
        };
        const faceB: Face = {
          ...shared,
          id: uid("face"),
          variant: "b",
          content: input.faceB,
        };
        mutate((current) => ({
          ...current,
          ombres: [ombre, ...current.ombres],
          faces: [faceA, faceB, ...current.faces],
          facesThisMonth: current.facesThisMonth + 1,
        }));
        return { ombre, faces: [faceA, faceB] };
      },
      markCopied: (faceId) => {
        mutate((current) => ({
          ...current,
          faces: current.faces.map((face) =>
            face.id === faceId ? { ...face, copiedAt: new Date().toISOString() } : face,
          ),
        }));
      },
      markSent: (faceId) => {
        mutate((current) => ({
          ...current,
          faces: current.faces.map((face) =>
            face.id === faceId ? { ...face, sentMarkedAt: new Date().toISOString() } : face,
          ),
        }));
      },
      setOutcome: (faceId, outcome) => {
        mutate((current) => ({
          ...current,
          faces: current.faces.map((face) =>
            face.id === faceId ? { ...face, outcome } : face,
          ),
        }));
      },
      addLutherShare: (share) => {
        const item: LutherShare = {
          ...share,
          id: uid("lth"),
          createdAt: new Date().toISOString(),
        };
        mutate((current) => ({
          ...current,
          lutherShares: [item, ...current.lutherShares].slice(0, 30),
          lutherSharesToday: current.lutherSharesToday + 1,
        }));
        return item;
      },
      completeOnboarding: () => mutate((current) => ({ ...current, onboardingDone: true })),
      unlockDemo: () => mutate((current) => ({ ...current, demoUnlocked: true, paywallSeen: true })),
      markPaywallSeen: () => mutate((current) => ({ ...current, paywallSeen: true })),
      wipe: () => {
        const wiped = emptySnapshot();
        wiped.onboardingDone = true;
        setSnapshot(wiped);
      },
      exportJson: () => JSON.stringify(snapshot, null, 2),
    };
  }, [ready, snapshot]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore hors provider");
  return ctx;
}
