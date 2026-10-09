import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { getList } from "../../utils/i18nContent";
import { TextSection } from "./TextSection";

/** General "what is a QR code" block. Home only, so type pages do not repeat it. */
export const WhatIsQR = () => {
  const { t } = useTranslation();

  return (
    <TextSection
      id="what-is-qr"
      title={t("landing.home.whatIs.title")}
      icon={Info}
      paragraphs={getList<string>(t, "landing.home.whatIs.paragraphs")}
    />
  );
};
