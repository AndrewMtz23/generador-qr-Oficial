import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { QR_TYPE_LIST } from "../../config/qrTypes";
import type { UseQRGeneratorReturn } from "../../hooks/useQRGenerator";
import type { QRType } from "../../types";

interface QRTypeTabsProps {
  qrGenerator: UseQRGeneratorReturn;
}

/**
 * One chip per registry type. On phones the chips scroll horizontally (snap, active chip
 * centered); from `sm` up they wrap into a grid so every type stays visible.
 */
export const QRTypeTabs = ({ qrGenerator }: QRTypeTabsProps) => {
  const { t } = useTranslation();
  const { type, setType, setWhatsappPhone } = qrGenerator;
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the active chip visible in the scrolling row without moving the page.
  useEffect(() => {
    const list = listRef.current;
    const active = activeRef.current;
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [type]);

  const handleSelect = (next: QRType) => {
    // Going back to URL from WhatsApp clears only the WhatsApp phone.
    if (next === "url" && type === "whatsapp") {
      setWhatsappPhone("");
    }
    setType(next);
  };

  return (
    <div
      ref={listRef}
      role="group"
      aria-label={t("form.typeTabsLabel")}
      className="relative flex snap-x snap-mandatory gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800 sm:grid sm:snap-none sm:grid-cols-4 sm:overflow-visible"
    >
      {QR_TYPE_LIST.map(({ id, icon: Icon, navKey }) => {
        const isActive = type === id;
        return (
          <button
            key={id}
            ref={isActive ? activeRef : undefined}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(id as QRType)}
            className={`inline-flex min-h-[44px] shrink-0 cursor-pointer snap-start items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-colors duration-200 sm:whitespace-normal sm:text-center sm:leading-tight ${
              isActive
                ? "bg-teal-700 text-white shadow-sm dark:bg-teal-400 dark:text-slate-950"
                : "text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
            <span>{t(navKey)}</span>
          </button>
        );
      })}
    </div>
  );
};
