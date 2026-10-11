import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { MORE_NAV_TYPES } from "../../config/qrTypes";

interface MoreTypesMenuProps {
  /** `desktop`: floating panel in the header bar. `mobile`: inline section inside the mobile menu. */
  variant: "desktop" | "mobile";
}

const triggerClass = {
  desktop:
    "inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-lg px-2.5 text-sm xl:px-3 font-medium transition-colors duration-200",
  mobile:
    "flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-lg px-3 text-base font-medium transition-colors duration-200",
} as const;

const idleClass = {
  desktop: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  mobile: "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
} as const;

const activeClass = "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200";

const itemClass = (variant: "desktop" | "mobile") => ({ isActive }: { isActive: boolean }) =>
  `flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 ${
    variant === "mobile" ? "text-base" : ""
  } ${
    isActive
      ? activeClass
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;

/**
 * "Más tipos": disclosure listing the registry types that are not in the header bar.
 * The button has `aria-expanded`; Escape closes it and returns focus to the button; the arrow
 * keys, Home and End move between links, and Tab leaving the menu closes it.
 */
export const MoreTypesMenu = ({ variant }: MoreTypesMenuProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  // Link to focus once the list has mounted (ArrowDown on the closed button opens it first).
  const pendingFocus = useRef<number | null>(null);

  const hasActiveChild = MORE_NAV_TYPES.some((entry) => pathname === `/generador-qr/${entry.slug}`);

  // Close after navigating to a type.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Desktop panel: close on outside click.
  useEffect(() => {
    if (!open || variant !== "desktop") return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, variant]);

  const links = () => Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);

  const focusLink = (index: number) => {
    const all = links();
    if (all.length === 0) return;
    all[(index + all.length) % all.length].focus();
  };

  useEffect(() => {
    if (open && pendingFocus.current !== null) {
      focusLink(pendingFocus.current);
      pendingFocus.current = null;
    }
  });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      // Do not let the header's own Escape handler also act on this key press.
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    const all = links();
    const current = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (open) {
        focusLink(current + 1);
      } else {
        // Links are not mounted while closed: focus the first one after the next render.
        pendingFocus.current = 0;
        setOpen(true);
      }
    } else if (event.key === "ArrowUp" && open) {
      event.preventDefault();
      focusLink(current === -1 ? -1 : current - 1);
    } else if (event.key === "Home" && open && current !== -1) {
      event.preventDefault();
      focusLink(0);
    } else if (event.key === "End" && open && current !== -1) {
      event.preventDefault();
      focusLink(-1);
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (variant === "desktop" && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={variant === "desktop" ? "relative" : undefined} onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={`${triggerClass[variant]} ${hasActiveChild ? activeClass : idleClass[variant]}`}
      >
        {t("header.moreTypes")}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          id={listId}
          className={
            variant === "desktop"
              ? "absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
              : "ml-3 mt-1 space-y-1 border-l-2 border-slate-200 pl-2 dark:border-slate-700"
          }
        >
          {MORE_NAV_TYPES.map(({ slug, icon: Icon, navKey }) => (
            <li key={slug}>
              <NavLink to={`/generador-qr/${slug}`} className={itemClass(variant)}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t(navKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
