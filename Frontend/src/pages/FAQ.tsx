import { useTranslation } from "react-i18next";
import { HelpCircle, ChevronDown } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";

const faqItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const FAQ = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t("faq.title")} icon={HelpCircle}>
      <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-300">{t("faq.subtitle")}</p>

      <div className="space-y-3">
        {faqItems.map((index) => (
          <details
            key={index}
            className="group rounded-xl border border-slate-200 bg-white open:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:open:bg-slate-800/50"
          >
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 [&::-webkit-details-marker]:hidden">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t(`faq.question${index}`)}
              </h2>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-slate-600 transition-transform duration-200 group-open:rotate-180 dark:text-slate-400"
                aria-hidden="true"
              />
            </summary>
            <p className="px-4 pb-4 leading-relaxed text-slate-600 dark:text-slate-300">
              {t(`faq.answer${index}`)}
            </p>
          </details>
        ))}
      </div>
    </PageShell>
  );
};
