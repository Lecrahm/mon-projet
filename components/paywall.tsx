"use client";

import { Button } from "@/components/ui";

export function PaywallDialog({
  reason,
  onClose,
  onUnlock,
}: {
  reason: "faces" | "recipients" | "luther" | "history";
  onClose: () => void;
  onUnlock: () => void;
}) {
  const copy = {
    faces: "La 20e Face du mois, c’est le moment où l’outil devient un réflexe.",
    recipients: "Trois destinataires en free. Les suivants, c’est Pro — ou la démo.",
    luther: "Trois sketches Luther par jour en free. Le bureau, lui, reste en Face.",
    history: "L’historique free recule à 7 jours. Pro garde le fil.",
  }[reason];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-[28px] border border-gold/25 bg-ombre p-8 text-paper shadow-2xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Pro · bientôt</p>
        <h2 className="mt-3 font-serif text-4xl">14 € / mois TTC</h2>
        <p className="mt-4 leading-relaxed text-paper/70">{copy}</p>
        <ul className="mt-6 space-y-2 text-sm text-paper/80">
          <li>Faces illimitées (soft-cap abus)</li>
          <li>10 destinataires</li>
          <li>Historique complet · variante B · Luther 20/jour</li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          Stripe n’est pas branché en v0. La démo continue sans bloquer.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Button type="button" onClick={onUnlock}>
            Continuer en démo
          </Button>
          <Button type="button" tone="ghost" className="text-paper" onClick={onClose}>
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  );
}
