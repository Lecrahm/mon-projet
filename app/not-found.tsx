import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-ombre text-paper">
      <header className="px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-6 pb-24">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">404</p>
        <h1 className="mt-3 font-serif text-5xl">Cette page n’a pas de Face.</h1>
        <p className="mt-4 text-paper/65">Retour à l’accueil, ou directement au Studio.</p>
        <div className="mt-8 flex gap-4 text-sm">
          <Link href="/" className="text-gold hover:underline">
            Accueil
          </Link>
          <Link href="/app" className="text-gold hover:underline">
            App
          </Link>
        </div>
      </main>
    </div>
  );
}
