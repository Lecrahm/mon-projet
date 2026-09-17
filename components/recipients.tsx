"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/components/app-store";
import { PaywallDialog } from "@/components/paywall";
import { Button, Field, Select, TextArea, TextInput } from "@/components/ui";
import { CHANNEL_LABELS, POWER_HINTS, POWER_LABELS } from "@/lib/labels";
import { MAX_RECIPIENTS } from "@/lib/storage";
import type { Channel, PowerDistance, Recipient } from "@/lib/types";

const emptyDraft = {
  name: "",
  role: "",
  powerDistance: "up" as PowerDistance,
  channelDefault: "email" as Channel,
  styleNotes: "",
};

export function RecipientsView() {
  const router = useRouter();
  const params = useSearchParams();
  const store = useAppStore();
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(params.get("nouveau") === "1");
  const [paywall, setPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    if (store.snapshot.recipients.length >= MAX_RECIPIENTS) {
      setError("Plafond MVP : 10 destinataires.");
      return;
    }
    if (!store.snapshot.demoUnlocked && store.snapshot.recipients.length >= 3) {
      setPaywall(true);
      return;
    }
    setEditingId(null);
    setDraft(emptyDraft);
    setOpen(true);
  }

  function startEdit(recipient: Recipient) {
    setEditingId(recipient.id);
    setDraft({
      name: recipient.name,
      role: recipient.role,
      powerDistance: recipient.powerDistance,
      channelDefault: recipient.channelDefault,
      styleNotes: recipient.styleNotes,
    });
    setOpen(true);
  }

  function save() {
    if (!draft.name.trim()) {
      setError("Un nom, au minimum.");
      return;
    }
    setError(null);
    if (editingId) {
      store.updateRecipient(editingId, { ...draft, name: draft.name.trim() });
    } else {
      const result = store.addRecipient({ ...draft, name: draft.name.trim() });
      if (!result.ok) {
        if (result.reason === "paywall") setPaywall(true);
        else setError("Plafond MVP : 10 destinataires.");
        return;
      }
    }
    setOpen(false);
    router.replace("/app/destinataires");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Destinataires</p>
          <h1 className="mt-2 font-serif text-4xl">Jusqu’à dix visages</h1>
          <p className="mt-2 max-w-xl text-paper/60">
            La Face n’existe pas sans quelqu’un. Nom, rôle, pouvoir, canal, notes de registre.
          </p>
        </div>
        <Button type="button" onClick={startCreate}>
          Nouveau
        </Button>
      </div>

      {error ? (
        <p className="rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm">{error}</p>
      ) : null}

      {store.snapshot.recipients.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-gold/25 p-8">
          <p className="font-serif text-2xl">Ex. « Mon N+1 »</p>
          <p className="mt-2 text-paper/60">Le premier destinataire débloque le Studio.</p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {store.snapshot.recipients.map((recipient) => (
            <li
              key={recipient.id}
              className="rounded-[24px] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl">{recipient.name}</h2>
                  <p className="mt-1 text-sm text-paper/55">
                    {recipient.role || "Rôle non précisé"} · {POWER_LABELS[recipient.powerDistance]} ·{" "}
                    {CHANNEL_LABELS[recipient.channelDefault]}
                  </p>
                  {recipient.styleNotes ? (
                    <p className="mt-3 text-sm text-paper/70">{recipient.styleNotes}</p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button type="button" tone="ghost" size="sm" onClick={() => startEdit(recipient)}>
                    Éditer
                  </Button>
                  <Button
                    type="button"
                    tone="ghost"
                    size="sm"
                    onClick={() => store.deleteRecipient(recipient.id)}
                  >
                    Retirer
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-[28px] border border-gold/20 bg-ombre p-6 shadow-2xl">
            <h2 className="font-serif text-3xl">
              {editingId ? "Corriger le profil" : "Nouveau destinataire"}
            </h2>
            <div className="mt-5 space-y-4">
              <Field label="Nom">
                <TextInput
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder="Claire, Mon N+1, Client Dupont…"
                />
              </Field>
              <Field label="Rôle">
                <TextInput
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  placeholder="Directrice produit, compte clé…"
                />
              </Field>
              <Field label="Pouvoir" hint={POWER_HINTS[draft.powerDistance]}>
                <Select
                  value={draft.powerDistance}
                  onChange={(event) =>
                    setDraft({ ...draft, powerDistance: event.target.value as PowerDistance })
                  }
                >
                  {(Object.keys(POWER_LABELS) as PowerDistance[]).map((item) => (
                    <option key={item} value={item}>
                      {POWER_LABELS[item]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Canal par défaut">
                <Select
                  value={draft.channelDefault}
                  onChange={(event) =>
                    setDraft({ ...draft, channelDefault: event.target.value as Channel })
                  }
                >
                  {(Object.keys(CHANNEL_LABELS) as Channel[]).map((item) => (
                    <option key={item} value={item}>
                      {CHANNEL_LABELS[item]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Notes de registre" hint="« déteste l’ironie », « veut du bref », « vouvoiement »…">
                <TextArea
                  rows={3}
                  className="bg-black/30"
                  value={draft.styleNotes}
                  onChange={(event) => setDraft({ ...draft, styleNotes: event.target.value })}
                />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" tone="ghost" className="text-paper" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={save}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {paywall ? (
        <PaywallDialog
          reason="recipients"
          onClose={() => setPaywall(false)}
          onUnlock={() => {
            store.unlockDemo();
            setPaywall(false);
            setEditingId(null);
            setDraft(emptyDraft);
            setOpen(true);
          }}
        />
      ) : null}
    </div>
  );
}
