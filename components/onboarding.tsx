"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

const STEPS = [
  {
    kicker: "Ombre",
    title: "Ce que tu n’enverrais jamais.",
    body: "Tu dumpes l’intention brute. Elle reste ici. Rien ne part tout seul.",
    theme: "dark",
  },
  {
    kicker: "Face",
    title: "Deux versions, collables.",
    body: "Destinataire, canal, registre. Direct, Diplomate, Corporate FR. Tu copies. Tu décides.",
    theme: "light",
  },
  {
    kicker: "Luther",
    title: "Le sketch. Pas le bureau.",
    body: "Traducteur de colère pour le share. Watermark. Jamais pour le N+1.",
    theme: "ember",
  },
] as const;

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className={`w-full max-w-lg overflow-hidden rounded-[28px] border p-8 shadow-2xl ${
          step.theme === "light"
            ? "border-ink/10 bg-face text-ink"
            : step.theme === "ember"
              ? "border-ember/40 bg-[#1a0d0a] text-paper"
              : "border-gold/20 bg-ombre text-paper"
        }`}
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
          {String(index + 1).padStart(2, "0")} · {step.kicker}
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-tight">{step.title}</h2>
        <p className="mt-4 text-lg leading-relaxed opacity-75">{step.body}</p>
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((item, i) => (
              <span
                key={item.kicker}
                className={`h-1.5 w-8 rounded-full ${i === index ? "bg-gold" : "bg-current/20"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 ? (
              <Button
                type="button"
                tone="ghost"
                onClick={() => setIndex((n) => n - 1)}
              >
                Retour
              </Button>
            ) : null}
            <Button
              type="button"
              tone={step.theme === "light" ? "paper" : "primary"}
              onClick={() => (last ? onDone() : setIndex((n) => n + 1))}
            >
              {last ? "Créer mon premier destinataire" : "Continuer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
