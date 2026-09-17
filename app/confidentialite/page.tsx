import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-ombre text-paper">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/" className="text-sm text-gold">
          Accueil
        </Link>
      </header>
      <article className="mx-auto max-w-3xl space-y-4 px-6 pb-20 text-paper/75 leading-relaxed">
        <h1 className="font-serif text-5xl text-paper">Confidentialité</h1>
        <p>
          <strong className="text-paper">Base v0.</strong> Destinataires, Ombres, Faces et sketches Luther
          sont stockés dans votre navigateur (localStorage). Ils ne transitent vers un serveur
          que si vous générez une Face ou un Luther et qu’une clé LLM est configurée côté app.
        </p>
        <p>
          Finalité unique : générer votre Face (ou un sketch Luther). Pas d’entraînement sur vos
          contenus. Pas d’analytics du texte Ombre/Face.
        </p>
        <p>
          Si une clé OpenAI ou Anthropic est définie, le texte est envoyé au fournisseur le temps
          de la génération, selon leurs conditions. Sans clé, tout reste local (reformulateur déterministe).
        </p>
        <p>
          Droit à l’effacement : Réglages → Tout supprimer. En v0, c’est immédiat sur cet appareil.
        </p>
        <p>Contact fondateur : à préciser avant mise en production facturée.</p>
      </article>
    </div>
  );
}
