import { useTranslation } from "react-i18next";
import { Link, MessageCircle, Wifi, FileText } from "lucide-react";
import type { UseQRGeneratorReturn } from "../../hooks/useQRGenerator";
import type { QRType } from "../../types";

interface QRTypeTabsProps {
  qrGenerator: UseQRGeneratorReturn;
}

export const QRTypeTabs = ({ qrGenerator }: QRTypeTabsProps) => {
  const { t } = useTranslation();
  const { type, setType, setWhatsappPhone } = qrGenerator;

  const tabs: { value: QRType; label: string; icon: typeof Link }[] = [
    { value: "url", label: "URL", icon: Link },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "wifi", label: "WiFi", icon: Wifi },
    { value: "text", label: t("form.text"), icon: FileText },
  ];

  const handleSelect = (next: QRType) => {
    // Going back to URL from WhatsApp clears only the WhatsApp phone.
    if (next === "url" && type === "whatsapp") {
      setWhatsappPhone("");
    }
    setType(next);
  };

  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 sm:grid-cols-4">
      {tabs.map(({ value, label, icon: Icon }) => {
        const isActive = type === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(value)}
            className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 sm:text-base ${
              isActive
                ? "bg-teal-700 text-white shadow-sm dark:bg-teal-400 dark:text-slate-950"
                : "text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
