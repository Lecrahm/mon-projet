"use client";

import { useState } from "react";
import { useAppStore } from "@/components/app-store";
import { Button } from "@/components/ui";
import { FREE_FACE_MONTHLY, FREE_LUTHER_DAILY, FREE_RECIPIENTS, MAX_RECIPIENTS } from "@/lib/storage";

export function SettingsView() {
  const store = useAppStore();
  const [copied, setCopied] = useState(false);

  function exportData() {
    const blob = new Blob([store.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "face-ombre-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Réglages</p>
        <h1 className="mt-2 font-serif text-4xl">Compte local, v0</h1>
        <p className="mt-3 text-paper/65">
          Pas d’Apple, pas de Google, pas de Stripe en v0. Vos données tiennent dans ce navigateur.
        </p>
      </div>

      <section className="rounded-[24px] border border-white/10 p-6">
        <h2 className="font-serif text-2xl">Usage</h2>
        <ul className="mt-4 space-y-2 text-sm text-paper/75">
          <li>Faces ce mois : {store.snapshot.facesThisMonth} / {store.snapshot.demoUnlocked ? "démo" : FREE_FACE_MONTHLY}</li>
          <li>Destinataires : {store.snapshot.recipients.length} / {MAX_RECIPIENTS} (free {FREE_RECIPIENTS})</li>
          <li>Luther aujourd’hui : {store.snapshot.lutherSharesToday} / {store.snapshot.demoUnlocked ? "démo" : FREE_LUTHER_DAILY}</li>
          <li>Plan : {store.snapshot.demoUnlocked ? "Démo Pro (local)" : "Free"}</li>
        </ul>
      </section>

      <section className="rounded-[24px] border border-white/10 p-6">
        <h2 className="font-serif text-2xl">Vie privée</h2>
        <p className="mt-3 text-sm leading-relaxed text-paper/70">
          Finalité unique : générer votre Face. Pas d’entraînement sur Ombre/Face.
          Pas de feature employeur, même future. Tout supprimer est immédiat en v0 (localStorage).
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" tone="ghost" className="text-paper" onClick={exportData}>
            Exporter JSON
          </Button>
          <Button
            type="button"
            tone="ghost"
            className="text-paper"
            onClick={async () => {
              await navigator.clipboard.writeText(store.exportJson());
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copié" : "Copier l’export"}
          </Button>
          <Button
            type="button"
            tone="ember"
            onClick={() => {
              if (window.confirm("Tout supprimer de ce navigateur ?")) store.wipe();
            }}
          >
            Tout supprimer
          </Button>
        </div>
      </section>
    </div>
  );
}
