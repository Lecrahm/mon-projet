"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/components/app-store";
import { CHANNEL_LABELS, REGISTER_LABELS } from "@/lib/labels";
import { isHistoryLocked } from "@/lib/storage";

export function HistoryView() {
  const { snapshot } = useAppStore();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const recipient =
    snapshot.recipients.find((item) => item.id === recipientId) ?? snapshot.recipients[0];

  const items = useMemo(() => {
    if (!recipient) return [];
    const faces = snapshot.faces.filter((face) => face.recipientId === recipient.id);
    const ombreIds = [...new Set(faces.map((face) => face.ombreId))];
    return ombreIds.map((ombreId) => {
      const ombre = snapshot.ombres.find((item) => item.id === ombreId);
      const pair = faces.filter((face) => face.ombreId === ombreId);
      return { ombre, pair };
    });
  }, [recipient, snapshot.faces, snapshot.ombres]);

  if (snapshot.recipients.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-gold/25 p-8">
        <h1 className="font-serif text-4xl">Pas encore de fil</h1>
        <p className="mt-3 text-paper/60">Créez un destinataire, générez une Face, le fil apparaît ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Historique</p>
          <h1 className="mt-2 font-serif text-4xl">Ombre ↔ Face</h1>
        </div>
        <select
          value={recipient?.id ?? ""}
          onChange={(event) => setRecipientId(event.target.value)}
          className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm outline-none"
        >
          {snapshot.recipients.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <p className="text-paper/55">Aucune Face pour {recipient?.name} pour l’instant.</p>
      ) : (
        <ol className="space-y-6">
          {items.map(({ ombre, pair }) => {
            const locked = ombre
              ? isHistoryLocked(ombre.createdAt, snapshot.demoUnlocked)
              : false;
            return (
              <li key={ombre?.id ?? pair[0]?.id} className="grid gap-3 lg:grid-cols-2">
                <article className="rounded-[24px] border border-gold/15 bg-black/40 p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gold">Ombre</p>
                  <p className="mt-2 text-xs text-muted">
                    {ombre ? new Date(ombre.createdAt).toLocaleString("fr-FR") : ""}
                  </p>
                  <p className={`mt-3 font-serif text-lg leading-relaxed ${locked ? "blur-sm select-none" : ""}`}>
                    {ombre?.text}
                  </p>
                  {locked ? (
                    <p className="mt-3 text-xs text-muted">Historique free : 7 jours. Passez en démo Pro pour revoir.</p>
                  ) : null}
                </article>
                <div className="space-y-3">
                  {pair.map((face) => (
                    <article key={face.id} className="rounded-[24px] border border-white/10 bg-face p-5 text-ink">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-ink/45">
                        <span>
                          Face {face.variant.toUpperCase()} · {REGISTER_LABELS[face.register]} ·{" "}
                          {CHANNEL_LABELS[face.channel]}
                        </span>
                        {face.sentMarkedAt ? <span>Envoyée</span> : null}
                      </div>
                      <pre className={`mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed ${locked ? "blur-sm select-none" : ""}`}>
                        {face.content}
                      </pre>
                      {face.outcome ? (
                        <p className="mt-3 text-xs text-ink/50">Issue · {face.outcome}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
