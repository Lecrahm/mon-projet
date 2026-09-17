import Link from "next/link";

export function Logo({
  href = "/",
  light = false,
  compact = false,
}: {
  href?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span
        className="relative h-7 w-7 overflow-hidden rounded-full border border-gold/50"
        aria-hidden
      >
        <span className="absolute inset-y-0 left-0 w-1/2 bg-ombre" />
        <span className="absolute inset-y-0 right-0 w-1/2 bg-paper" />
      </span>
      <span
        className={`font-serif text-lg tracking-tight ${light ? "text-ink" : "text-paper"} ${compact ? "hidden sm:inline" : ""}`}
      >
        Face <span className="text-gold">&</span> Ombre
      </span>
    </Link>
  );
}
