import type { Metadata } from "next";
import { Studio } from "@/components/studio";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return <Studio />;
}
