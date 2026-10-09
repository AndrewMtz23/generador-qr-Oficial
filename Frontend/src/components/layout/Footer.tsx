import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { QrCode, Check, Github, Linkedin, Facebook } from "lucide-react";
import { BRAND_NAME } from "../../constants";

const GENERATOR_LINKS = [
  { to: "/generador-qr/url", labelKey: "header.nav.url" },
  { to: "/generador-qr/whatsapp", labelKey: "header.nav.whatsapp" },
  { to: "/generador-qr/wifi", labelKey: "header.nav.wifi" },
  { to: "/generador-qr/texto", labelKey: "header.nav.text" },
] as const;

const PROJECT_LINKS = [
  { to: "/faq", labelKey: "footer.faq" },
  { to: "/about", labelKey: "footer.about" },
  { to: "/donaciones", labelKey: "footer.donations" },
] as const;

const LEGAL_LINKS = [
  { to: "/terms", labelKey: "footer.terms" },
  { to: "/privacy", labelKey: "footer.privacy" },
  { to: "/cookies", labelKey: "footer.cookies" },
] as const;

const footerLink =
  "inline-flex min-h-[32px] cursor-pointer items-center text-slate-600 transition-colors duration-200 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300";

const socialLink =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-teal-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-300";

export const Footer = () => {
  const { t } = useTranslation();

  const linkColumn = (
    titleKey: string,
    links: ReadonlyArray<{ to: string; labelKey: string }>,
  ) => (
    <nav aria-label={t(titleKey)}>
      <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">{t(titleKey)}</h3>
      <ul className="space-y-1 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className={footerLink}>
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <Link to="/" className="mb-3 inline-flex items-center gap-2 rounded-lg">
              <span className="icon-chip h-9 w-9 bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950">
                <QrCode className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {BRAND_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("footer.description")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {(["footer.free", "footer.instant", "footer.unlimited"] as const).map((key) => (
                <li key={key} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {linkColumn("footer.generators", GENERATOR_LINKS)}
          {linkColumn("footer.project", PROJECT_LINKS)}
          {linkColumn("footer.legal", LEGAL_LINKS)}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} {BRAND_NAME} · {t("footer.madeBy")}{" "}
            <span className="font-semibold text-slate-900 dark:text-white">Edu Armas</span>
          </p>
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/BigNight1"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLink}
              aria-label="GitHub de Edu Armas"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/edu-armas/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLink}
              aria-label="LinkedIn de Edu Armas"
            >
              <Linkedin className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61558087662014"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLink}
              aria-label="Facebook BigNight"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
