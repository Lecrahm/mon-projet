"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui";
import { renderLutherCard } from "@/lib/luther-card";
import { STORAGE_KEY } from "@/lib/storage";
import type { AppSnapshot } from "@/lib/types";

function readShare(id: string): { title: string; rant: string } | null {
  if (typeof window === "undefined") return null;
  const session = window.sessionStorage.getItem(`luther-share:${id}`);
  if (session) {
    try {
      return JSON.parse(session) as { title: string; rant: string };
    } catch {
      return null;
    }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as AppSnapshot;
    const share = snapshot.lutherShares.find((item) => item.id === id);
    if (share) return { title: share.title, rant: share.rant };
  } catch {
    return null;
  }
  return null;
}

export function LutherShareView({ id }: { id: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const payload = useSyncExternalStore(
    () => () => {},
    () => readShare(id),
    () => null,
  );

  useEffect(() => {
    if (!payload || !canvasRef.current) return;
    renderLutherCard(canvasRef.current, payload);
  }, [payload]);

  return (
    <div className="min-h-full bg-ombre text-paper">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/app">
          <Button size="sm">Ouvrir l’app</Button>
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-16">
        {payload ? (
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Luther</p>
            <h1 className="font-serif text-5xl">{payload.title}</h1>
            <p className="max-w-2xl font-serif text-xl leading-relaxed text-paper/80">
              {payload.rant}
            </p>
            <div className="overflow-hidden rounded-[28px] border border-gold/20">
              <canvas ref={canvasRef} className="h-auto w-full" />
            </div>
            <p className="text-sm text-muted">
              Watermark Face & Ombre. Le rant n’est pas un message. La Face, si.
            </p>
          </div>
        ) : (
          <div className="rounded-[28px] border border-gold/20 p-10">
            <h1 className="font-serif text-4xl">Carte Luther introuvable ici.</h1>
            <p className="mt-4 max-w-lg text-paper/65">
              Les sketches v0 vivent dans le navigateur qui les a créés. Téléchargez le PNG
              pour partager ailleurs — ou ouvrez l’app et faites-en un autre.
            </p>
            <Link href="/app/luther" className="mt-6 inline-block">
              <Button tone="ember">Mode Luther</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
