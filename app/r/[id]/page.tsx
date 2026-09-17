import type { Metadata } from "next";
import { LutherShareView } from "@/components/luther-share";

export const metadata: Metadata = {
  title: "Luther",
  description: "Carte Luther — Face & Ombre. Le sketch, pas le bureau.",
};

export default async function LutherSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LutherShareView id={id} />;
}
