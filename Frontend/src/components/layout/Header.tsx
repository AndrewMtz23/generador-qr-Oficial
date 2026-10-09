import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { QrCode, User, Moon, Sun, History, Menu, X } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLanguage } from "../../hooks/useLanguage";
import { BRAND_NAME, SUPPORTED_LANGUAGES } from "../../constants";

interface HeaderProps {
  onLoginClick: () => void;
}

const NAV_ITEMS = [
  { to: "/generador-qr/url", labelKey: "header.nav.url" },
  { to: "/generador-qr/whatsapp", labelKey: "header.nav.whatsapp" },
  { to: "/generador-qr/wifi", labelKey: "header.nav.wifi" },
  { to: "/generador-qr/texto", labelKey: "header.nav.text" },
  { to: "/faq", labelKey: "header.faq" },
] as const;

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-[40px] items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium transition-colors duration-200 ${
    isActive
      ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200"
      : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

const iconButtonClass =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:h-10 lg:w-10";

export const Header = ({ onLoginClick }: HeaderProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Escape closes the mobile menu and returns focus to its toggle.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const themeLabel = darkMode ? t("header.lightMode") : t("header.darkMode");
  const themeIcon = darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />;

  const languageSwitch = (large: boolean) => (
    <div role="group" aria-label={t("header.language")} className="flex items-center">
      {SUPPORTED_LANGUAGES.map((code, index) => {
        const isCurrent = currentLanguage.startsWith(code);
        return (
          <span key={code} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                ·
              </span>
            )}
            <button
              type="button"
              lang={code}
              aria-pressed={isCurrent}
              onClick={() => changeLanguage(code)}
              className={`cursor-pointer rounded-lg px-2 text-sm font-semibold transition-colors duration-200 ${
                large ? "min-h-[44px] min-w-[44px]" : "min-h-[40px]"
              } ${
                isCurrent
                  ? "text-teal-700 dark:text-teal-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {code.toUpperCase()}
            </button>
          </span>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex min-h-[44px] items-center gap-2 rounded-lg"
          >
            <span className="icon-chip h-9 w-9 bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {BRAND_NAME}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label={t("header.mainNav")} className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-1 lg:flex">
            <NavLink
              to="/history"
              aria-label={t("header.history")}
              title={t("header.history")}
              className={({ isActive }) =>
                `${iconButtonClass} ${isActive ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200" : ""}`
              }
            >
              <History className="h-5 w-5" aria-hidden="true" />
            </NavLink>
            {languageSwitch(false)}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={iconButtonClass}
              aria-label={themeLabel}
              title={themeLabel}
            >
              {themeIcon}
            </button>
            <button type="button" onClick={onLoginClick} className="btn-secondary ml-2 !min-h-[40px] !px-4 !py-1.5 text-sm">
              <User className="h-4 w-4" aria-hidden="true" />
              <span>{t("header.login")}</span>
            </button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={iconButtonClass}
              aria-label={themeLabel}
            >
              {themeIcon}
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={iconButtonClass}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? t("header.menuClose") : t("header.menuOpen")}
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="container-page space-y-4 py-4">
            <nav aria-label={t("header.mainNav")} className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileLinkClass}>
                  {t(item.labelKey)}
                </NavLink>
              ))}
              <NavLink to="/history" className={mobileLinkClass}>
                <History className="mr-2 h-5 w-5" aria-hidden="true" />
                {t("header.history")}
              </NavLink>
            </nav>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("header.language")}</span>
              {languageSwitch(true)}
            </div>

            <button
              type="button"
              onClick={() => {
                onLoginClick();
                setIsMenuOpen(false);
              }}
              className="btn-secondary w-full"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span>{t("header.login")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
