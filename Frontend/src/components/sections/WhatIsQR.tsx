import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";

const paragraphKeys = ["description1", "description2", "description3", "description4"] as const;

export const WhatIsQR = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-14 dark:bg-slate-900 sm:py-16">
      <div className="container-page">
        <div className="mb-6 flex items-center gap-3">
          <span className="icon-chip">
            <Info className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t("sections.whatIsQR.title")}
          </h2>
        </div>
        <div className="max-w-prose space-y-4">
          {paragraphKeys.map((key) => (
            <p key={key} className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t(`sections.whatIsQR.${key}`)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
