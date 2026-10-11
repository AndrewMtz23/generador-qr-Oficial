import type { QRType } from "../config/qrTypes";

/** Internal QR type id. Derived from the registry in `config/qrTypes.ts`. */
export type { QRType };
export type OutputFormat = "jpg" | "png" | "pdf" | "svg";
export type Language = "es" | "en" | "pt";
export type WiFiSecurity = "WPA" | "WPA2" | "WEP" | "nopass";

export interface QRFormData {
  url: string;
  whatsappMessage: string;
  wifiSSID: string;
  wifiPassword: string;
  wifiSecurity: WiFiSecurity;
  wifiHidden: boolean;
  textContent: string;
  type: QRType;
  qrSize: number;
  enableLogo: boolean;
  logoFile: File | null;
  outputFormat: OutputFormat;
  qrColor: string;
}

/** Raw string values of a field-driven form (keys are the field names in the registry). */
export type FieldValues = Readonly<Record<string, string>>;

/** Result of validating a field-driven form: field name -> error/warning code. Errors block generation. */
export interface ValidationResult {
  errors: Record<string, string>;
  warnings: Record<string, string>;
}
