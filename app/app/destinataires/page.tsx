import { Suspense } from "react";
import type { Metadata } from "next";
import { RecipientsView } from "@/components/recipients";

export const metadata: Metadata = { title: "Destinataires" };

export default function RecipientsPage() {
  return (
    <Suspense fallback={<div className="text-paper/50">Chargement…</div>}>
      <RecipientsView />
    </Suspense>
  );
}
