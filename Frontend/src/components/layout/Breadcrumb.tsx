import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentLabel: string;
}

/** Home › current page. Mirrors the BreadcrumbList JSON-LD of type pages. */
export const Breadcrumb = ({ currentLabel }: BreadcrumbProps) => {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("landing.common.breadcrumbLabel")} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
        <li>
          <Link to="/" className="inline-flex min-h-[32px] items-center font-medium hover:text-teal-700 dark:hover:text-teal-300">
            {t("landing.common.breadcrumbHome")}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-4 w-4" />
        </li>
        <li aria-current="page" className="font-medium text-slate-900 dark:text-white">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
};
