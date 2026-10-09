import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  /** Use `title` only as the dialog accessible name (children render their own heading). */
  hideTitle?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, showCloseButton = true, hideTitle = false }: ModalProps) => {
  const { t } = useTranslation();

  // Escape closes the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={t("alerts.close")}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {title && !hideTitle && (
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        )}

        {children}
      </div>
    </div>
  );
};
