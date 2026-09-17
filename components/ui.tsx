import type { ButtonHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, InputHTMLAttributes } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  tone = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "ghost" | "paper" | "ember" | "ink";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    primary:
      "bg-gold text-ink hover:bg-gold-deep disabled:opacity-50",
    ghost:
      "bg-transparent text-current border border-current/20 hover:border-current/50 hover:bg-white/5",
    paper:
      "bg-ink text-paper hover:bg-black",
    ember:
      "bg-ember text-paper hover:bg-[#a94a2e]",
    ink:
      "bg-paper text-ink hover:bg-white",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition disabled:cursor-not-allowed",
        tones[tone],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-current/55">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-current/45">{hint}</span> : null}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border border-current/15 bg-black/20 px-3 py-2.5 text-sm outline-none transition placeholder:text-current/35 focus:border-gold/70",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "w-full resize-none rounded-2xl border border-current/15 bg-black/20 px-4 py-3 text-base leading-relaxed outline-none transition placeholder:text-current/35 focus:border-gold/70",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "w-full rounded-xl border border-current/15 bg-black/20 px-3 py-2.5 text-sm outline-none transition focus:border-gold/70",
        className,
      )}
      {...props}
    />
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-current/15 p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cx(
              "rounded-full px-3 py-1.5 text-xs tracking-wide transition",
              active ? "bg-gold text-ink" : "text-current/70 hover:text-current",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
