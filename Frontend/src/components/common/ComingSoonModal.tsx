import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { Modal } from "./Modal";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal = ({ isOpen, onClose }: ComingSoonModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("header.login")} hideTitle>
      <div className="text-center">
        <span className="icon-chip mx-auto mb-4 h-16 w-16 rounded-full">
          <User className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{t("header.login")}</h3>
        <p className="text-slate-600 dark:text-slate-300">{t("alerts.comingSoon")}</p>
      </div>
    </Modal>
  );
};
