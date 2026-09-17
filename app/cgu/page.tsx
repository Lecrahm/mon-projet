import Link from "next/link";
import { Logo } from "@/components/logo";

function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-ombre text-paper">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/" className="text-sm text-gold">
          Accueil
        </Link>
      </header>
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <h1 className="font-serif text-5xl">{title}</h1>
        <div className="mt-8 space-y-4 text-paper/75 leading-relaxed">{children}</div>
      </article>
    </div>
  );
}

export default function CguPage() {
  return (
    <LegalShell title="Conditions d’utilisation">
      <p>Face & Ombre est un outil de communication asymétrique. L’Ombre est privée. La Face est ce que vous choisissez d’envoyer. Luther est un mode comique d’acquisition, pas le produit.</p>
      <p>Vous restez responsable des messages que vous copiez et envoyez. L’app ne les envoie pas à votre place.</p>
      <p>Version web v0 : pas de compte obligatoire, pas d’abonnement Stripe live, pas de clavier iOS. Les quotas Free/Pro sont simulés localement.</p>
      <p>Promesse employeur : aucune fonctionnalité ne permettra jamais à un tiers (manager, RH, « Team ») de lire vos Ombres.</p>
      <p>Luther : pas de harcèlement, pas de doxxing, pas de haine ciblée. Les contenus refusés le sont sans moraline sur la frustration professionnelle ordinaire.</p>
    </LegalShell>
  );
}
