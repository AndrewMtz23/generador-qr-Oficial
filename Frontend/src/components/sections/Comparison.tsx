import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { getList } from "../../utils/i18nContent";
import { SectionShell } from "./SectionShell";

interface ComparisonRow {
  feature: string;
  us: string;
  others: string;
}

const cellBase =
  "block px-4 py-3 align-top text-sm leading-relaxed text-slate-700 before:mb-1 before:block before:text-xs before:font-semibold before:uppercase before:tracking-wide before:text-slate-600 before:content-[attr(data-label)] dark:text-slate-300 dark:before:text-slate-400 md:table-cell md:px-5 md:text-base md:before:hidden";

/**
 * Home: honest comparison table. On small screens each row becomes a stacked block
 * (the header row stays in the accessibility tree via sr-only).
 */
export const Comparison = () => {
  const { t } = useTranslation();
  const rows = getList<ComparisonRow>(t, "landing.home.compare.rows");
  const colUs = t("landing.home.compare.colUs");
  const colOthers = t("landing.home.compare.colOthers");

  return (
    <SectionShell
      id="why-qr-gratis"
      title={t("landing.home.compare.title")}
      icon={ShieldCheck}
      tone="muted"
      intro={t("landing.home.compare.intro")}
    >
      <div className="card overflow-hidden">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{t("landing.home.compare.caption")}</caption>
          <thead className="max-md:sr-only">
            <tr className="border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60">
              <th scope="col" className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                {t("landing.home.compare.colFeature")}
              </th>
              <th scope="col" className="px-5 py-3 text-sm font-semibold text-teal-800 dark:text-teal-300">
                {colUs}
              </th>
              <th scope="col" className="px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                {colOthers}
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {rows.map((row) => (
              <tr
                key={row.feature}
                className="block border-b border-slate-200 last:border-b-0 dark:border-slate-800 md:table-row"
              >
                <th
                  scope="row"
                  className="block bg-slate-50 px-4 pb-1 pt-3 text-left text-base font-semibold text-slate-900 dark:bg-slate-800/40 dark:text-white md:table-cell md:bg-transparent md:px-5 md:py-3 md:align-top md:dark:bg-transparent"
                >
                  {row.feature}
                </th>
                <td data-label={colUs} className={`${cellBase} bg-teal-50/60 dark:bg-teal-950/30`}>
                  {row.us}
                </td>
                <td data-label={colOthers} className={cellBase}>
                  {row.others}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {t("landing.home.compare.note")}
      </p>
    </SectionShell>
  );
};
