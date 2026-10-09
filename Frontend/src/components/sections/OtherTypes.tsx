import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, QrCode } from "lucide-react";
import { GENERATOR_ROUTE_TYPES, type GeneratorRouteType } from "../../config/seo";
import { TYPE_ICONS } from "../../config/landing";
import { SectionShell } from "./SectionShell";

interface OtherTypesProps {
  current: GeneratorRouteType;
}

/** Type pages: links to the other three QR type pages. */
export const OtherTypes = ({ current }: OtherTypesProps) => {
  const { t } = useTranslation();

  return (
    <SectionShell
      id="other-types"
      title={t("landing.common.otherTitle")}
      icon={QrCode}
      tone="muted"
      intro={t("landing.common.otherIntro")}
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {GENERATOR_ROUTE_TYPES.filter((type) => type !== current).map((type) => {
          const Icon = TYPE_ICONS[type];
          return (
            <li key={type}>
              <Link
                to={`/generador-qr/${type}`}
                className="card group flex h-full cursor-pointer items-start gap-4 p-5 transition-colors duration-200 hover:border-teal-700 dark:hover:border-teal-400"
              >
                <span className="icon-chip">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="block">
                  <span className="block text-lg font-semibold text-slate-900 dark:text-white">
                    {t(`landing.types.${type}.breadcrumb`)}
                  </span>
                  <span className="mt-1 block leading-relaxed text-slate-600 dark:text-slate-300">
                    {t(`landing.types.${type}.other`)}
                  </span>
                  <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    {t("landing.home.types.cta")}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
};
