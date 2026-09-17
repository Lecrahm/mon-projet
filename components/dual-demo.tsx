"use client";

import { useState } from "react";
import { REGISTER_LABELS } from "@/lib/labels";
import type { Register } from "@/lib/types";

const OMBRE =
  "Claire n’a pas répondu depuis 12 jours. Si le brief n’est pas validé vendredi, on rate le sprint. J’en ai marre d’être le seul à porter ce dossier, elle s’en fout.";

const FACES: Record<Register, string> = {
  direct: `Salut Claire,

Je relance sur le brief : sans validation vendredi, on rate le sprint. Peux-tu me confirmer un go ?

Merci.`,
  diplomate: `Bonjour Claire,

Je me permets de revenir vers toi. Je sais que tu es sollicitée. Sans validation du brief vendredi, le sprint bascule. Peux-tu me faire un retour — ou me dire un créneau si le timing est mauvais ?

Merci d’avance,`,
  corporate: `Bonjour Claire,

Le brief n’a pas été validé depuis 12 jours. Sans décision vendredi, l’engagement sprint n’est plus tenable. Je vous remercie de bien vouloir me confirmer votre accord.

Cordialement,`,
};

export function DualDemo() {
  const [register, setRegister] = useState<Register>("diplomate");

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-gold/20 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] lg:grid-cols-2">
      <div className="grain relative bg-ombre px-7 py-8 text-paper sm:px-10 sm:py-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Ombre · privée</p>
        <h3 className="mt-3 font-serif text-3xl">Ce que je pense</h3>
        <p className="mt-6 font-serif text-xl leading-relaxed text-paper/85">{OMBRE}</p>
        <p className="mt-8 text-xs text-muted">Jamais envoyée automatiquement.</p>
      </div>
      <div className="bg-face px-7 py-8 text-ink sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-deep">Face · envoyable</p>
          <div className="flex gap-1 rounded-full bg-ink/5 p-1">
            {(Object.keys(REGISTER_LABELS) as Register[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRegister(key)}
                className={`rounded-full px-3 py-1 text-[11px] tracking-wide ${
                  register === key ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
                }`}
              >
                {REGISTER_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
        <h3 className="mt-3 font-serif text-3xl">Ce que j’envoie</h3>
        <pre className="mt-6 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-ink/85">
          {FACES[register]}
        </pre>
        <p className="mt-8 text-xs text-ink/45">Destinataire : Claire · N+1 · email</p>
      </div>
    </div>
  );
}
