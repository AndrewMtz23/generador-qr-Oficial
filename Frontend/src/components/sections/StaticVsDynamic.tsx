import { useTranslation } from "react-i18next";
import { Check, Minus, Scale } from "lucide-react";
import { getList } from "../../utils/i18nContent";
import { RichText } from "../common/RichText";
import { SectionShell } from "./SectionShell";

/** Home: plain-language comparison of static and dynamic QR codes. */
export const StaticVsDynamic = () => {
  const { t } = useTranslation();
  const staticPoints = getList<string>(t, "landing.home.staticVsDynamic.static.points");
  const dynamicPoints = getList<string>(t, "landing.home.staticVsDynamic.dynamic.points");

  return (
    <SectionShell
      id="static-vs-dynamic"
      title={t("landing.home.staticVsDynamic.title")}
      icon={Scale}
      intro={t("landing.home.staticVsDynamic.intro")}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="card border-teal-700 p-6 dark:border-teal-400">
          <h3 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
            {t("landing.home.staticVsDynamic.static.title")}
          </h3>
          <p className="mb-4 text-sm font-medium text-teal-800 dark:text-teal-300">
            {t("landing.home.staticVsDynamic.static.badge")}
          </p>
          <ul className="space-y-3">
            {staticPoints.map((point) => (
              <li key={point} className="flex gap-3 leading-relaxed text-slate-700 dark:text-slate-300">
                <Check className="mt-1 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card p-6">
          <h3 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
            {t("landing.home.staticVsDynamic.dynamic.title")}
          </h3>
          <p className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            {t("landing.home.staticVsDynamic.dynamic.badge")}
          </p>
          <ul className="space-y-3">
            {dynamicPoints.map((point) => (
              <li key={point} className="flex gap-3 leading-relaxed text-slate-700 dark:text-slate-300">
                <Minus className="mt-1 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-8 max-w-prose space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("landing.home.staticVsDynamic.choose.title")}
        </h3>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
          <RichText text={t("landing.home.staticVsDynamic.choose.static")} />
        </p>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
          <RichText text={t("landing.home.staticVsDynamic.choose.dynamic")} />
        </p>
      </div>
    </SectionShell>
  );
};
