"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/components/app-store";
import { PaywallDialog } from "@/components/paywall";
import { Button, TextArea } from "@/components/ui";
import { hashString } from "@/lib/ids";
import { renderLutherCard } from "@/lib/luther-card";
import { FREE_LUTHER_DAILY } from "@/lib/storage";
import type { LutherApiResponse } from "@/lib/types";

export function LutherStudio() {
  const store = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [rant, setRant] = useState("");
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paywall, setPaywall] = useState(false);

  useEffect(() => {
    if (!rant || !canvasRef.current) return;
    renderLutherCard(canvasRef.current, { title, rant });
  }, [rant, title]);

  async function generate() {
    if (!text.trim()) {
      setError("Collez un mail trop poli, ou une Ombre trop vraie.");
      return;
    }
    if (!store.snapshot.demoUnlocked && store.snapshot.lutherSharesToday >= FREE_LUTHER_DAILY) {
      setPaywall(true);
      return;
    }
    setBusy(true);
    setError(null);
    setWarning(null);
    try {
      const res = await fetch("/api/luther", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json()) as LutherApiResponse & { message?: string };
      if (!data.ok) {
        setError(data.message);
        return;
      }
      setTitle(data.title);
      setRant(data.rant);
      setWarning(data.warning ?? null);
      const share = store.addLutherShare({
        sourceHash: hashString(text),
        rant: data.rant,
        title: data.title,
      });
      setShareId(share.id);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          `luther-share:${share.id}`,
          JSON.stringify({ title: data.title, rant: data.rant }),
        );
      }
    } catch {
      setError("Réseau instable. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function copyRant() {
    await navigator.clipboard.writeText(`${title}\n\n${rant}\n\n— Face & Ombre, mode Luther`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `luther-${shareId ?? "carte"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[28px] border border-ember/35 bg-gradient-to-b from-[#2a120c] to-ombre p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Luther · acquisition</p>
        <h1 className="mt-3 font-serif text-4xl">Traducteur de colère</h1>
        <p className="mt-3 max-w-md text-paper/65">
          Sketch. Pas doxxing. Pas pour le N+1. Watermark Face & Ombre, et on rentre au bureau.
        </p>
        <div className="mt-6">
          <TextArea
            rows={10}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Collez le mail trop lisse — ou l’Ombre trop vraie."
          />
        </div>
        {error ? (
          <p className="mt-4 rounded-2xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {store.snapshot.lutherSharesToday}/{FREE_LUTHER_DAILY} sketches free aujourd’hui
          </p>
          <Button type="button" tone="ember" disabled={busy} onClick={() => void generate()}>
            {busy ? "Montée en volume…" : "Générer le rant"}
          </Button>
        </div>
      </section>

      <section className="rounded-[28px] border border-gold/20 bg-black/40 p-6 sm:p-8">
        {!rant ? (
          <div className="flex h-full min-h-[320px] flex-col justify-center text-paper/45">
            <p className="font-serif text-3xl text-paper/70">Le micro est coupé.</p>
            <p className="mt-3">Luther parlera ici. Puis vous copierez, ou vous exportiez la carte.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {warning ? (
              <p className="rounded-2xl bg-gold/15 px-4 py-3 text-sm text-paper">{warning}</p>
            ) : null}
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{title}</p>
            <p className="font-serif text-xl leading-relaxed text-paper/90">{rant}</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={() => void copyRant()}>
                {copied ? "Copié" : "Copier"}
              </Button>
              <Button type="button" size="sm" tone="ghost" className="text-paper" onClick={downloadPng}>
                Télécharger la carte PNG
              </Button>
              {shareId ? (
                <Link href={`/r/${shareId}`}>
                  <Button type="button" size="sm" tone="ghost" className="text-paper">
                    Page share
                  </Button>
                </Link>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-[24px] border border-gold/20">
              <canvas ref={canvasRef} className="h-auto w-full" />
            </div>
            <p className="text-xs text-muted">
              Watermark intégré. Luther n’envoie rien. C’est le point.
            </p>
          </div>
        )}
      </section>

      {paywall ? (
        <PaywallDialog
          reason="luther"
          onClose={() => setPaywall(false)}
          onUnlock={() => {
            store.unlockDemo();
            setPaywall(false);
          }}
        />
      ) : null}
    </div>
  );
}
