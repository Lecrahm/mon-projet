"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/components/app-store";
import { PaywallDialog } from "@/components/paywall";
import { Button, Field, Segmented, Select, TextArea } from "@/components/ui";
import { requestFace } from "@/lib/client-generate";
import { CHANNEL_LABELS, REGISTER_HINTS, REGISTER_LABELS } from "@/lib/labels";
import { FREE_FACE_MONTHLY } from "@/lib/storage";
import type {
  Channel,
  Face,
  Ombre,
  Outcome,
  Register,
} from "@/lib/types";

const CHANNELS = Object.keys(CHANNEL_LABELS) as Channel[];
const REGISTERS = Object.keys(REGISTER_LABELS) as Register[];

export function Studio() {
  const store = useAppStore();
  const recipients = store.snapshot.recipients;
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const recipient =
    recipients.find((item) => item.id === recipientId) ?? recipients[0];
  const [channel, setChannel] = useState<Channel | null>(null);
  const selectedChannel = channel ?? recipient?.channelDefault ?? "email";
  const [register, setRegister] = useState<Register>("diplomate");
  const [ombre, setOmbre] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [engine, setEngine] = useState<string | null>(null);
  const [result, setResult] = useState<{ ombre: Ombre; faces: Face[] } | null>(null);
  const [paywall, setPaywall] = useState<"faces" | null>(null);
  const [copied, setCopied] = useState<"a" | "b" | null>(null);
  const [burst, setBurst] = useState(false);

  async function generate() {
    if (!recipient) {
      setError("Créez d’abord un destinataire.");
      return;
    }
    if (!ombre.trim()) {
      setError("Écrivez ce que vous n’enverriez jamais.");
      return;
    }
    if (!store.snapshot.demoUnlocked && store.snapshot.facesThisMonth >= FREE_FACE_MONTHLY) {
      setPaywall("faces");
      return;
    }
    setBusy(true);
    setError(null);
    setWarning(null);
    try {
      const data = await requestFace({
        ombreText: ombre,
        register,
        channel: selectedChannel,
        recipient: {
          name: recipient.name,
          role: recipient.role,
          powerDistance: recipient.powerDistance,
          styleNotes: recipient.styleNotes,
        },
      });
      if (!data.ok) {
        setError(data.message);
        setResult(null);
        return;
      }
      setEngine(data.engine);
      setWarning(data.warning ?? null);
      const recorded = store.recordGeneration({
        ombreText: ombre,
        recipientId: recipient.id,
        register,
        channel: selectedChannel,
        faceA: data.face_a,
        faceB: data.face_b,
        riskNote: data.risk_note,
        dropped: data.dropped,
      });
      setResult(recorded);
    } catch {
      setError("Impossible de générer la Face. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function copyFace(face: Face, variant: "a" | "b") {
    await navigator.clipboard.writeText(face.content);
    store.markCopied(face.id);
    setCopied(variant);
    if (!burst) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 1200);
    }
    window.setTimeout(() => setCopied(null), 1600);
  }

  const faceA = result?.faces.find((face) => face.variant === "a");
  const faceB = result?.faces.find((face) => face.variant === "b");

  function patchResult(faceId: string, patch: Partial<Face>) {
    setResult((current) =>
      current
        ? {
            ...current,
            faces: current.faces.map((face) =>
              face.id === faceId ? { ...face, ...patch } : face,
            ),
          }
        : current,
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {burst ? <span className="pointer-events-none fixed inset-0 z-40 confetti-soft" /> : null}

      <section className="grain relative overflow-hidden rounded-[28px] border border-gold/15 bg-ombre p-5 text-paper sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Ombre</p>
            <h1 className="mt-2 font-serif text-3xl">Ce que tu n’enverras pas</h1>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted">
            Privé
          </span>
        </div>

        {recipients.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gold/25 p-6">
            <p className="font-serif text-xl">Un destinataire d’abord.</p>
            <p className="mt-2 text-sm text-paper/60">
              Nom, rôle, pouvoir, canal. Ensuite l’Ombre.
            </p>
            <Link href="/app/destinataires?nouveau=1" className="mt-4 inline-block">
              <Button>Créer un destinataire</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Destinataire">
                <Select
                  value={recipient?.id ?? ""}
                  onChange={(event) => {
                    const next = recipients.find((item) => item.id === event.target.value);
                    setRecipientId(event.target.value);
                    if (next) setChannel(next.channelDefault);
                  }}
                >
                  {recipients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                      {item.role ? ` · ${item.role}` : ""}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Canal">
                <Select
                  value={selectedChannel}
                  onChange={(event) => setChannel(event.target.value as Channel)}
                >
                  {CHANNELS.map((item) => (
                    <option key={item} value={item}>
                      {CHANNEL_LABELS[item]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Registre" hint={REGISTER_HINTS[register]}>
              <Segmented
                value={register}
                onChange={setRegister}
                options={REGISTERS.map((item) => ({
                  value: item,
                  label: REGISTER_LABELS[item],
                }))}
              />
            </Field>

            <Field label="Ombre">
              <TextArea
                rows={11}
                value={ombre}
                onChange={(event) => setOmbre(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                    event.preventDefault();
                    void generate();
                  }
                }}
                placeholder="Écris ce que tu n’enverrais jamais."
              />
            </Field>

            {error ? (
              <p className="rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">⌘ / Ctrl + Entrée pour générer</p>
              <Button type="button" disabled={busy} onClick={() => void generate()}>
                {busy ? "Reformulation…" : "Générer la Face"}
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-face p-5 text-ink sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-deep">Face</p>
            <h2 className="mt-2 font-serif text-3xl">Ce que tu peux envoyer</h2>
          </div>
          {engine ? (
            <span className="rounded-full bg-ink/5 px-3 py-1 text-[11px] text-ink/50">
              {engine === "mock" ? "Moteur local" : `Modèle · ${engine}`}
            </span>
          ) : null}
        </div>

        {!result ? (
          <div className="mt-16 space-y-3 text-ink/40">
            <p className="font-serif text-2xl text-ink/55">L’Ombre reste ici.</p>
            <p>La Face apparaîtra à droite — deux versions, prêtes à coller.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {warning ? (
              <p className="rounded-2xl bg-gold/15 px-4 py-3 text-sm">{warning}</p>
            ) : null}
            {faceA ? (
              <FaceCard
                label="Face A"
                face={faceA}
                copied={copied === "a"}
                onCopy={() => void copyFace(faceA, "a")}
                onSent={() => {
                  store.markSent(faceA.id);
                  patchResult(faceA.id, { sentMarkedAt: new Date().toISOString() });
                }}
                onOutcome={(outcome) => {
                  store.setOutcome(faceA.id, outcome);
                  patchResult(faceA.id, { outcome });
                }}
              />
            ) : null}
            {faceB ? (
              <FaceCard
                label="Face B · variante"
                face={faceB}
                copied={copied === "b"}
                onCopy={() => void copyFace(faceB, "b")}
                onSent={() => {
                  store.markSent(faceB.id);
                  patchResult(faceB.id, { sentMarkedAt: new Date().toISOString() });
                }}
                onOutcome={(outcome) => {
                  store.setOutcome(faceB.id, outcome);
                  patchResult(faceB.id, { outcome });
                }}
              />
            ) : null}
            {faceA?.riskNote ? (
              <p className="text-sm text-ink/55">Risque restant · {faceA.riskNote}</p>
            ) : null}
            {faceA?.dropped.length ? (
              <div className="flex flex-wrap gap-2">
                {faceA.dropped.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-ink/5 px-3 py-1 text-[11px] text-ink/55"
                  >
                    non dit · {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>

      {paywall ? (
        <PaywallDialog
          reason={paywall}
          onClose={() => setPaywall(null)}
          onUnlock={() => {
            store.unlockDemo();
            setPaywall(null);
          }}
        />
      ) : null}
    </div>
  );
}

function FaceCard({
  label,
  face,
  copied,
  onCopy,
  onSent,
  onOutcome,
}: {
  label: string;
  face: Face;
  copied: boolean;
  onCopy: () => void;
  onSent: () => void;
  onOutcome: (outcome: Outcome | null) => void;
}) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-white/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">{label}</p>
        {face.sentMarkedAt ? (
          <span className="text-[11px] text-gold-deep">Envoyée</span>
        ) : null}
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed">
        {face.content}
      </pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" tone="paper" size="sm" onClick={onCopy}>
          {copied ? "Copié" : "Copier"}
        </Button>
        <Button type="button" tone="ghost" size="sm" onClick={onSent}>
          Marquer envoyé
        </Button>
      </div>
      {face.sentMarkedAt ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {(["opened", "won", "clash"] as Outcome[]).map((outcome) => (
            <button
              key={outcome}
              type="button"
              onClick={() => onOutcome(face.outcome === outcome ? null : outcome)}
              className={`rounded-full px-3 py-1 text-[11px] ${
                face.outcome === outcome ? "bg-ink text-paper" : "bg-ink/5 text-ink/60"
              }`}
            >
              {outcome === "opened" ? "Ouvert" : outcome === "won" ? "Gagné" : "Clash"}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
