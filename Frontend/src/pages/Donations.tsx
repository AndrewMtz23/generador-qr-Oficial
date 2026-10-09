import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, Copy, Check, Hand } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { useState } from "react";

export const Donations = () => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const copyButton = (text: string, id: string) => (
    <button
      type="button"
      onClick={() => handleCopy(text, id)}
      className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      aria-label={t("history.copy")}
      title={t("history.copy")}
    >
      {copiedId === id ? (
        <Check className="h-5 w-5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
      ) : (
        <Copy className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );

  const codeClass =
    "flex-1 truncate rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-white";

  return (
    <>
      <div className="bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
        <div className="container-page">
          <Link
            to="/"
            className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span>{t("history.back")}</span>
          </Link>

          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <span className="icon-chip mb-4 h-14 w-14 rounded-full">
                <Heart className="h-7 w-7" aria-hidden="true" />
              </span>
              <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {t("donations.title")}
              </h1>
              <p className="mx-auto max-w-prose text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {t("donations.subtitle")}
              </p>
            </div>

            {/* Not required notice */}
            <div className="mb-8 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/50">
              <p className="text-center text-sm text-teal-900 dark:text-teal-100">
                {t("donations.notRequired")}
              </p>
            </div>

            {/* Personal message */}
            <div className="card mb-8 p-6">
              <p className="mb-1 flex items-center gap-2 text-lg text-slate-800 dark:text-slate-200">
                <Hand className="h-5 w-5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                {t("donations.greeting")}
              </p>
              <p className="mb-4 text-sm font-medium text-teal-700 dark:text-teal-300">
                {t("donations.role")}
              </p>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {t("donations.message")}
              </p>
            </div>

            {/* Donation methods */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                {t("donations.methodsTitle")}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Yape */}
                <div className="card flex flex-col items-center p-5 text-center">
                  <h3 className="mb-3 w-full text-left font-semibold text-slate-900 dark:text-white">Yape</h3>
                  <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700">
                    <img
                      src="/QRyape.jpeg"
                      alt="QR Yape"
                      className="h-36 w-36 rounded-lg object-contain sm:h-40 sm:w-40"
                    />
                  </div>
                  <p className="mb-2 w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    {t("donations.yapeNumber")}
                  </p>
                  <div className="flex w-full items-center gap-2">
                    <code className={codeClass}>{t("donations.yapePlaceholder")}</code>
                    {copyButton(t("donations.yapePlaceholder"), "yape")}
                  </div>
                </div>

                {/* Plin */}
                <div className="card flex flex-col items-center p-5 text-center">
                  <h3 className="mb-3 w-full text-left font-semibold text-slate-900 dark:text-white">Plin</h3>
                  <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700">
                    <img
                      src="/QRplin.jpeg"
                      alt="QR Plin"
                      className="h-36 w-36 rounded-lg object-contain sm:h-40 sm:w-40"
                    />
                  </div>
                  <p className="mb-2 w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    {t("donations.plinNumber")}
                  </p>
                  <div className="flex w-full items-center gap-2">
                    <code className={codeClass}>{t("donations.plinPlaceholder")}</code>
                    {copyButton(t("donations.plinPlaceholder"), "plin")}
                  </div>
                </div>

                {/* PayPal */}
                <div className="card p-5 sm:col-span-2">
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">PayPal</h3>
                  <a
                    href={t("donations.paypalLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block cursor-pointer overflow-hidden rounded-lg"
                    title={t("donations.paypalCta")}
                  >
                    <img
                      src="/DonateWithPaypal.png"
                      alt={t("donations.paypalCta")}
                      className="h-12 w-auto object-contain sm:h-14"
                    />
                  </a>
                </div>

                {/* Binance Pay */}
                <div className="card flex w-full flex-col items-center gap-6 p-5 sm:col-span-2 sm:flex-row sm:p-6">
                  <div className="flex shrink-0 flex-col items-center">
                    <h3 className="mb-3 w-full text-left font-semibold text-slate-900 dark:text-white sm:text-center">
                      Binance Pay
                    </h3>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700">
                      <img
                        src="/qrBinancePay.jpeg"
                        alt="QR Binance Pay"
                        className="h-40 w-40 rounded-lg object-contain sm:h-44 sm:w-44"
                      />
                    </div>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                      {t("donations.binancePayHint")}
                    </p>
                  </div>
                  <div className="flex w-full flex-1 flex-col items-center justify-center text-center sm:w-auto sm:items-start sm:text-left">
                    <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                      {t("donations.binancePayIdLabel")}
                    </p>
                    <div className="flex w-full max-w-xs items-center justify-center gap-2 sm:max-w-none sm:justify-start">
                      <code className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-base font-semibold text-slate-900 dark:bg-slate-800 dark:text-white">
                        835276198
                      </code>
                      {copyButton("835276198", "binance")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency */}
            <div className="card mb-8 p-6">
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                {t("donations.transparencyTitle")}
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-slate-600 marker:text-teal-700 dark:text-slate-300 dark:marker:text-teal-400">
                <li>{t("donations.transparency1")}</li>
                <li>{t("donations.transparency2")}</li>
                <li>{t("donations.transparency3")}</li>
              </ul>
            </div>

            {/* Thanks + CTA */}
            <div className="text-center">
              <p className="mb-6 text-slate-700 dark:text-slate-300">{t("donations.thanks")}</p>
              <Link to="/" className="btn-secondary">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("donations.backToGenerator")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
