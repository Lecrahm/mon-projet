import type { Metadata } from "next";
import { LutherStudio } from "@/components/luther-studio";

export const metadata: Metadata = { title: "Luther" };

export default function LutherPage() {
  return <LutherStudio />;
}
