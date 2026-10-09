import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "./PageShell";

interface LegalPageProps {
  /** i18n namespace under `legal.*`, e.g. "terms". */
  namespace: "terms" | "privacy" | "cookies";
  sectionCount: number;
  icon: LucideIcon;
}

export const LegalPage = ({ namespace, sectionCount, icon }: LegalPageProps) => {
  const { t } = useTranslation();
  const sections = Array.from({ length: sectionCount }, (_, i) => i + 1);

  return (
    <PageShell title={t(`legal.${namespace}.title`)} icon={icon}>
      <p className="mb-8 text-sm text-slate-600 dark:text-slate-400">
        {t(`legal.${namespace}.lastUpdated`)}: {new Date().toLocaleDateString()}
      </p>
      {sections.map((n) => (
        <section key={n} className="mb-8 last:mb-0">
          <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
            {t(`legal.${namespace}.section${n}.title`)}
          </h2>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            {t(`legal.${namespace}.section${n}.content`)}
          </p>
        </section>
      ))}
    </PageShell>
  );
};
