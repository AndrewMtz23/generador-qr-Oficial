import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, QrCode, Download, Copy, Check } from "lucide-react";
import { getQRHistory, formatDate, clearQRHistory, type QRHistoryItem } from "../../utils/historyUtils";
import { downloadImage } from "../../utils/qrUtils";
import { useState, useEffect } from "react";
import type { OutputFormat } from "../../types";

export const History = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setHistory(getQRHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm(t("history.confirmClear"))) {
      clearQRHistory();
      setHistory([]);
    }
  };

  const handleDownload = async (image: string, format: OutputFormat, index: number) => {
    try {
      await downloadImage(image, `qrcode-${index + 1}`, format);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert(t("history.downloadError"));
    }
  };

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedIndex(index);
        setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);
      } catch (err) {
        console.error("Error al copiar:", err);
        alert(t("history.copyError"));
      }
      document.body.removeChild(textArea);
    }
  };

  const backLink = (
    <Link
      to="/"
      className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      <span>{t("history.back")}</span>
    </Link>
  );

  if (history.length === 0) {
    return (
      <div className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
        <div className="container-page min-h-[60vh]">
          {backLink}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t("history.title")}
          </h1>

          <div className="flex justify-center py-16">
            <div className="card px-10 py-12 text-center">
              <span className="icon-chip mx-auto mb-4 h-14 w-14">
                <QrCode className="h-8 w-8" aria-hidden="true" />
              </span>
              <p className="text-lg text-slate-600 dark:text-slate-300">{t("history.empty")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="container-page min-h-[60vh]">
        {backLink}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t("history.title")}
            </h1>
            <button
              type="button"
              onClick={handleClearHistory}
              className="btn border border-red-200 bg-red-50 text-sm text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>{t("history.clear")}</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("history.subtitle").replace("{{count}}", history.length.toString())}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {history.map((item, index) => (
            <div key={index} className="card overflow-hidden">
              {/* QR image */}
              <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-3 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={t("qr.imageAlt")}
                    className="h-auto w-full max-w-[200px] rounded-lg bg-white p-2"
                  />
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {t("history.size")}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.size ? `${item.size} × ${item.size} px` : t("history.sizeUnknown")}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 p-4">
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      {t("history.url")}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url, index)}
                      className="inline-flex min-h-[32px] cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-semibold text-teal-700 transition-colors duration-200 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950"
                      title={t("history.copyUrl")}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t("history.copied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t("history.copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="line-clamp-2 break-all text-sm text-slate-900 dark:text-white">{item.url}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      {t("history.format")}
                    </p>
                    <p className="text-sm font-semibold uppercase text-slate-900 dark:text-white">
                      {item.format || "png"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      {t("history.date")}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{formatDate(item.date)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(item.image, (item.format || "png") as OutputFormat, index)}
                  className="btn-secondary w-full text-sm"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{t("history.download")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
