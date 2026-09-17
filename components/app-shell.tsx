"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppStoreProvider, useAppStore } from "@/components/app-store";
import { Logo } from "@/components/logo";
import { Onboarding } from "@/components/onboarding";

const NAV = [
  { href: "/app", label: "Studio" },
  { href: "/app/destinataires", label: "Destinataires" },
  { href: "/app/historique", label: "Historique" },
  { href: "/app/luther", label: "Luther" },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, snapshot, weekFaces, completeOnboarding } = useAppStore();
  const showOnboarding = ready && !snapshot.onboardingDone;

  return (
    <div className="min-h-full bg-ombre text-paper">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ombre/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Logo href="/" compact />
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm">
            {NAV.map((item) => {
              const active =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                    active ? "bg-white/10 text-gold" : "text-paper/55 hover:text-paper"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-4 sm:flex">
            <p className="text-xs tracking-wide text-muted">
              <span className="font-medium text-gold">{weekFaces}</span> Faces · cette semaine
            </p>
            <Link href="/app/reglages" className="text-xs text-paper/50 hover:text-gold">
              Réglages
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      {showOnboarding ? (
        <Onboarding
          onDone={() => {
            completeOnboarding();
            router.push("/app/destinataires?nouveau=1");
          }}
        />
      ) : null}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <ShellInner>{children}</ShellInner>
    </AppStoreProvider>
  );
}
