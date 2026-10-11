import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { RichText } from "../common/RichText";

interface SectionShellProps {
  id: string;
  title: string;
  icon: LucideIcon;
  /** Sections alternate between white and slate backgrounds. */
  tone?: "white" | "muted";
  intro?: string;
  children: ReactNode;
}

const TONES = {
  white: "bg-white dark:bg-slate-900",
  muted: "bg-slate-50 dark:bg-slate-950",
} as const;

/** Shared frame for landing sections: icon chip + h2, optional intro, then content. */
export const SectionShell = ({ id, title, icon: Icon, tone = "white", intro, children }: SectionShellProps) => (
  <section id={id} aria-labelledby={`${id}-title`} className={`${TONES[tone]} py-14 sm:py-16`}>
    <div className="container-page">
      <div className="mb-4 flex items-center gap-3">
        <span className="icon-chip">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2
          id={`${id}-title`}
          className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          {title}
        </h2>
      </div>
      {intro && (
        <p className="mb-8 max-w-prose text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <RichText text={intro} />
        </p>
      )}
      {!intro && <div className="mb-4" />}
      {children}
    </div>
  </section>
);
