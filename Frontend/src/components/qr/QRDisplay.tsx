import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { QrCode, Download, Heart, Lightbulb } from "lucide-react";
import type { UseQRGeneratorReturn } from "../../hooks/useQRGenerator";

interface QRDisplayProps {
  qrGenerator: UseQRGeneratorReturn;
}

export const QRDisplay = ({ qrGenerator }: QRDisplayProps) => {
  const { t } = useTranslation();
  const { qrCodeImage, selectedSize, handleDownloadQR, outputFormat } = qrGenerator;

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        {t("qr.title")}
      </h3>

      <div aria-live="polite" className="flex flex-1 flex-col items-center">
        {qrCodeImage ? (
          <>
            {/* QR is always shown on white so it stays scannable in dark mode */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700">
              <img
                src={qrCodeImage}
                alt={t("qr.imageAlt")}
                className="h-auto w-full max-w-[240px] rounded"
              />
            </div>

            <dl className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  {t("qr.size")}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedSize} × {selectedSize} px
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                  {t("qr.format")}
                </dt>
                <dd className="mt-1 text-sm font-semibold uppercase text-slate-900 dark:text-white">
                  {outputFormat}
                </dd>
              </div>
            </dl>

            <button type="button" onClick={handleDownloadQR} className="btn-cta mt-5 w-full">
              <Download className="h-5 w-5" aria-hidden="true" />
              <span>{t("qr.download")}</span>
            </button>

            <p className="mt-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <span>{t("qr.tip")}</span>
            </p>

            {/* Support / donations */}
            <div className="mt-5 flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                <Heart className="h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                {t("qr.supportCta")}
              </p>
              <Link to="/donaciones" className="text-link text-sm">
                {t("qr.viewDonations")}
              </Link>
            </div>
          </>
        ) : (
          <div className="flex w-full flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800/40">
            <span className="icon-chip mb-4 h-14 w-14">
              <QrCode className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="font-semibold text-slate-900 dark:text-white">{t("qr.placeholder")}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t("qr.placeholderText")}</p>
            <p className="mt-5 max-w-xs text-sm text-slate-600 dark:text-slate-400">
              {t("qr.instructions")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
