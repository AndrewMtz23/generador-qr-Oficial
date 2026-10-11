import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, QrCode } from "lucide-react";
import { QR_TYPE_LIST } from "../../config/qrTypes";
import { SectionShell } from "./SectionShell";

/** Home: one card per QR type, each linking to its own landing page. */
export const TypeCards = () => {
  const { t } = useTranslation();

  return (
    <SectionShell
      id="qr-types"
      title={t("landing.home.types.title")}
      icon={QrCode}
      tone="muted"
      intro={t("landing.home.types.intro")}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QR_TYPE_LIST.map(({ slug: type, icon: Icon }) => {
          return (
            <li key={type}>
              <Link
                to={`/generador-qr/${type}`}
                className="card group flex h-full cursor-pointer flex-col p-6 transition-colors duration-200 hover:border-teal-700 dark:hover:border-teal-400"
              >
                <span className="icon-chip mb-4">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {t(`landing.home.types.cards.${type}.title`)}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  {t(`landing.home.types.cards.${type}.text`)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(`landing.home.types.cards.${type}.example`)}
                </p>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-teal-700 dark:text-teal-300">
                  {t("landing.home.types.cta")}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
};
