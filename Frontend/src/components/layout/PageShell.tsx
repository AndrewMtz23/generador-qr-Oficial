import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Footer } from "./Footer";

interface PageShellProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

/** Shared frame for text pages: back link, single h1, readable card, footer. */
export const PageShell = ({ title, icon: Icon, children }: PageShellProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
        <div className="container-page max-w-3xl">
          <Link to="/" className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span>{t("history.back")}</span>
          </Link>
          <div className="card p-6 sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <span className="icon-chip">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {title}
              </h1>
            </div>
            <div className="max-w-prose">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
