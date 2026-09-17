import Link from "next/link";
import { DualDemo } from "@/components/dual-demo";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui";

export function LandingPage() {
  return (
    <div className="min-h-full bg-ombre text-paper">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/app/luther" className="hidden text-paper/60 hover:text-gold sm:inline">
            Luther
          </Link>
          <Link href="/app">
            <Button tone="primary" size="sm">
              Ouvrir l’app
            </Button>
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Communication asymétrique
          </p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[1.05] sm:text-6xl">
            Dis la vérité en Ombre.
            <span className="block text-gold">Envoie la Face qui passe.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70">
            En 30 secondes, passez de ce que vous pensez vraiment à un message
            que vous pouvez envoyer — sans vous tirer une balle dans le pied.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app">
              <Button size="lg">Écrire une Ombre</Button>
            </Link>
            <Link href="/app/luther">
              <Button tone="ghost" size="lg" className="text-paper">
                Le mode Luther
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            Web, français d’abord. Pas un AI writer. Pas un traducteur de colère.
          </p>
        </div>
        <DualDemo />
      </section>

      <section className="border-t border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-3">
          {[
            {
              kicker: "01 · Ombre",
              title: "L’intention brute",
              body: "Vous dumpz ce que vous n’enverriez jamais. Ça reste privé. Aucun envoi automatique. Jamais.",
            },
            {
              kicker: "02 · Destinataire",
              title: "La personne réelle",
              body: "Jusqu’à 10 profils : rôle, distance de pouvoir, canal, notes de registre. La Face n’est pas générique.",
            },
            {
              kicker: "03 · Face",
              title: "Deux versions collables",
              body: "Direct, Diplomate ou Corporate FR. Copier. Marquer envoyé. Optionnel : ouvert, gagné, clash.",
            },
          ].map((item) => (
            <article key={item.kicker} className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{item.kicker}</p>
              <h2 className="font-serif text-3xl">{item.title}</h2>
              <p className="text-paper/65 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="overflow-hidden rounded-[28px] border border-ember/40 bg-gradient-to-br from-[#2a120c] to-ombre p-8 sm:p-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Acquisition · pas le cœur</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl sm:text-5xl">
            Luther existe pour le share.
            <span className="block text-paper/70">Pas pour le bureau.</span>
          </h2>
          <p className="mt-5 max-w-xl text-paper/70 leading-relaxed">
            Un rant comique, une carte image, un watermark. Trois sketches free par jour.
            Si vous cherchez un clone Obama : ce n’est pas ici.
          </p>
          <Link href="/app/luther" className="mt-8 inline-block">
            <Button tone="ember" size="lg">
              Essayer Luther
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Une métrique. Pas un dashboard.</h2>
          <p className="mt-4 text-paper/65 leading-relaxed">
            Faces cette semaine. C’est tout. L’app sert à envoyer, pas à se contempler.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">Vie privée, v0 honnête.</h2>
          <p className="mt-4 text-paper/65 leading-relaxed">
            Sur le web MVP, Ombres et Faces restent dans votre navigateur. Pas d’entraînement
            sur vos textes. Pas de lecture employeur — jamais, même plus tard.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted">
          <p>Face & Ombre · communication asymétrique</p>
          <div className="flex gap-5">
            <Link href="/cgu" className="hover:text-gold">
              CGU
            </Link>
            <Link href="/confidentialite" className="hover:text-gold">
              Confidentialité
            </Link>
            <Link href="/app" className="hover:text-gold">
              App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
