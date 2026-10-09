import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Link,
  Image as ImageIcon,
  Wifi,
  Eye,
  EyeOff,
  FileText,
  Loader2,
} from "lucide-react";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import { QR_CONFIG } from "../../constants";
import type { UseQRGeneratorReturn } from "../../hooks/useQRGenerator";
import type { WiFiSecurity } from "../../types";

const SUPPORTED_ISO2_CODES = [
  "pe", // Perú
  "mx", // México
  "ar", // Argentina
  "br", // Brasil
  "cl", // Chile
  "co", // Colombia
  "ve", // Venezuela
  "uy", // Uruguay
  "py", // Paraguay
  "bo", // Bolivia
  "ec", // Ecuador
  "cr", // Costa Rica
  "pa", // Panamá
  "ni", // Nicaragua
  "sv", // El Salvador
  "gt", // Guatemala
  "hn", // Honduras
  "do", // República Dominicana
  "pr", // Puerto Rico
  "cu", // Cuba
  "es", // España
  "pt", // Portugal
  "us", // Estados Unidos
] as const;

const SUPPORTED_COUNTRIES = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return SUPPORTED_ISO2_CODES.includes(iso2 as (typeof SUPPORTED_ISO2_CODES)[number]);
});

const FIELD_ICON =
  "pointer-events-none absolute left-3 h-5 w-5 text-slate-500 dark:text-slate-400";

const CHECKBOX =
  "h-5 w-5 cursor-pointer rounded border-slate-300 text-teal-700 focus:ring-teal-700 dark:border-slate-600 dark:bg-slate-950 dark:text-teal-400";

interface QRFormProps {
  qrGenerator: UseQRGeneratorReturn;
}

export const QRForm = ({ qrGenerator }: QRFormProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    url,
    setUrl,
    whatsappPhone,
    setWhatsappPhone,
    whatsappMessage,
    setWhatsappMessage,
    wifiSSID,
    setWifiSSID,
    wifiPassword,
    setWifiPassword,
    wifiSecurity,
    setWifiSecurity,
    wifiHidden,
    setWifiHidden,
    textContent,
    setTextContent,
    type,
    qrSize,
    setQrSize,
    enableLogo,
    setEnableLogo,
    logoPreview,
    outputFormat,
    setOutputFormat,
    qrColor,
    setQrColor,
    loading,
    handleLogoChange,
    generateQRCode,
  } = qrGenerator;

  return (
    <div className="space-y-5">
      {/* Fields by QR type */}
      {type === "text" ? (
        <div>
          <label htmlFor="qr-text" className="field-label">
            {t("form.textLabel")}
          </label>
          <div className="relative">
            <FileText className={`${FIELD_ICON} top-3.5`} aria-hidden="true" />
            <textarea
              id="qr-text"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={t("form.textPlaceholder")}
              className="field pl-10"
              rows={4}
            />
          </div>
          <p className="field-hint">{t("form.textHint")}</p>
        </div>
      ) : type === "wifi" ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="qr-wifi-ssid" className="field-label">
              {t("form.wifiSSID")}
            </label>
            <div className="relative">
              <Wifi className={`${FIELD_ICON} top-1/2 -translate-y-1/2`} aria-hidden="true" />
              <input
                id="qr-wifi-ssid"
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder={t("form.wifiSSIDPlaceholder")}
                className="field pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="qr-wifi-password" className="field-label">
              {t("form.wifiPassword")}
            </label>
            <div className="relative">
              <input
                id="qr-wifi-password"
                type={showPassword ? "text" : "password"}
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder={t("form.wifiPasswordPlaceholder")}
                className="field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                aria-label={
                  showPassword ? t("form.hidePassword") : t("form.showPassword")
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="qr-wifi-security" className="field-label">
              {t("form.wifiSecurity")}
            </label>
            <select
              id="qr-wifi-security"
              value={wifiSecurity}
              onChange={(e) => setWifiSecurity(e.target.value as WiFiSecurity)}
              className="field"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">{t("form.wifiNoPassword")}</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="wifiHidden"
              checked={wifiHidden}
              onChange={(e) => setWifiHidden(e.target.checked)}
              className={CHECKBOX}
            />
            <label
              htmlFor="wifiHidden"
              className="cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {t("form.wifiHidden")}
            </label>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label
              htmlFor={type === "url" ? "qr-url" : "qr-whatsapp-phone"}
              className="field-label"
            >
              {type === "url" ? t("form.urlLabel") : t("form.whatsappLabel")}
            </label>
            {/* URL input (always mounted, only visible for the URL type) */}
            <div className={type === "url" ? "relative" : "hidden"}>
              <Link className={`${FIELD_ICON} top-1/2 -translate-y-1/2`} aria-hidden="true" />
              <input
                id="qr-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("form.urlPlaceholder")}
                className="field pl-10"
              />
            </div>

            {/* WhatsApp PhoneInput (always mounted, only visible for the WhatsApp type) */}
            <div className={type === "whatsapp" ? "block" : "hidden"}>
              <div className="rounded-lg border border-slate-300 bg-white transition-colors focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/30 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-teal-400 dark:focus-within:ring-teal-400/30">
                <PhoneInput
                  defaultCountry="pe"
                  countries={SUPPORTED_COUNTRIES}
                  value={whatsappPhone}
                  onChange={(phone) => setWhatsappPhone(phone)}
                  placeholder={t("form.whatsappPlaceholder")}
                  inputProps={{ id: "qr-whatsapp-phone" }}
                  className="!w-full"
                  inputClassName="!w-full !border-0 !bg-transparent !text-base !text-slate-900 !shadow-none focus:!outline-none focus:!ring-0 dark:!text-slate-100"
                  countrySelectorStyleProps={{
                    buttonClassName:
                      "!border-0 !border-r !border-slate-300 !bg-transparent dark:!border-slate-700",
                  }}
                />
              </div>
            </div>
          </div>

          {/* WhatsApp message */}
          {type === "whatsapp" && (
            <div>
              <label htmlFor="qr-whatsapp-message" className="field-label">
                {t("form.whatsappMessage")}
              </label>
              <textarea
                id="qr-whatsapp-message"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder={t("form.whatsappMessagePlaceholder")}
                className="field"
                rows={3}
              />
            </div>
          )}
        </>
      )}

      {/* Customization options */}
      <div className="space-y-5 border-t border-slate-200 pt-5 dark:border-slate-800">
        {/* Size slider */}
        <div>
          <label id="qr-size-label" htmlFor="qr-size-slider" className="field-label">
            {t("form.sizeLabel")}
          </label>
          <div
            className="relative"
            onDragStart={(e) => e.preventDefault()}
            onDrag={(e) => e.preventDefault()}
            onDragEnd={(e) => e.preventDefault()}
          >
            <input
              id="qr-size-slider"
              type="range"
              min={QR_CONFIG.MIN_SIZE}
              max={QR_CONFIG.MAX_SIZE}
              step={QR_CONFIG.STEP_SIZE}
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onDragStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              draggable="false"
              className="slider h-6 w-full cursor-pointer select-none bg-transparent"
              aria-labelledby="qr-size-label"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("form.lowQuality")}
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {qrSize} x {qrSize} Px
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("form.highQuality")}
            </span>
          </div>
        </div>

        {/* Color + format */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label id="qr-color-label" htmlFor="qr-color-picker" className="field-label">
              {t("form.colorLabel")}
            </label>
            <div className="flex items-center gap-3">
              <input
                id="qr-color-picker"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-950"
                aria-labelledby="qr-color-label"
              />
              <input
                type="text"
                value={qrColor}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    setQrColor(value);
                  }
                }}
                placeholder="#000000"
                className="field min-w-0 flex-1 font-mono"
                aria-labelledby="qr-color-label"
              />
            </div>
            <p className="field-hint">{t("form.colorHint")}</p>
          </div>

          <div>
            <label id="qr-format-label" htmlFor="qr-format-select" className="field-label">
              {t("form.formatLabel")}
            </label>
            <select
              id="qr-format-select"
              value={outputFormat}
              onChange={(e) =>
                setOutputFormat(e.target.value as "jpg" | "png" | "pdf" | "svg")
              }
              className="field"
              aria-labelledby="qr-format-label"
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>

        {/* Logo option */}
        <div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableLogo"
              checked={enableLogo}
              onChange={(e) => {
                setEnableLogo(e.target.checked);
                if (!e.target.checked) {
                  qrGenerator.setLogoFile(null);
                  qrGenerator.setLogoPreview("");
                }
              }}
              className={CHECKBOX}
            />
            <label
              htmlFor="enableLogo"
              className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              <ImageIcon className="h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              {t("form.enableLogo")}
            </label>
          </div>

          {enableLogo && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="qr-logo-file" className="field-label">
                  {t("form.selectLogo")}
                </label>
                <input
                  id="qr-logo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-teal-800 hover:file:bg-teal-100 dark:text-slate-400 dark:file:bg-teal-950 dark:file:text-teal-200 dark:hover:file:bg-teal-900"
                />
                <p className="field-hint">{t("form.logoFormats")}</p>
              </div>

              {logoPreview && (
                <div>
                  <p className="field-label">{t("form.logoPreview")}</p>
                  <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <img
                      src={logoPreview}
                      alt="Preview del logo"
                      className="max-h-[100px] max-w-[100px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={generateQRCode}
        disabled={loading}
        aria-busy={loading}
        className="btn-cta w-full"
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {loading ? t("form.generating") : t("form.generateButton")}
      </button>
    </div>
  );
};
