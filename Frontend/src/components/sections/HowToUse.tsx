import { useTranslation } from "react-i18next";
import { ListChecks } from "lucide-react";

export const HowToUse = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-50 py-14 dark:bg-slate-950 sm:py-16">
      <div className="container-page">
        <div className="mb-8 flex items-center gap-3">
          <span className="icon-chip">
            <ListChecks className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t("sections.howToUse.title")}
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((step) => (
            <li key={step} className="card p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 font-heading text-lg font-bold text-white dark:bg-teal-400 dark:text-slate-950">
                {step}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                {t(`sections.howToUse.step${step}.title`)}
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {t(`sections.howToUse.step${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
