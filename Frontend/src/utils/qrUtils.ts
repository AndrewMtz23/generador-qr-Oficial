import type { QRType, OutputFormat, WiFiSecurity } from "../types";
import { loadImage } from "../lib/qr/raster";
import { saveBlob } from "../lib/qr/download";

/**
 * Genera la URL final para WhatsApp
 * @param phoneNumber - Número de teléfono
 * @param message - Mensaje opcional
 * @returns URL de WhatsApp
 */
export const generateWhatsAppUrl = (phoneNumber: string, message?: string): string => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

/**
 * Genera el string de WiFi en formato estándar para QR
 * @param ssid - Nombre de la red WiFi
 * @param password - Contraseña de la red
 * @param security - Tipo de seguridad (WPA, WPA2, WEP, nopass)
 * @param hidden - Si la red está oculta
 * @returns String de WiFi en formato QR
 */
export const generateWiFiString = (
  ssid: string,
  password: string,
  security: WiFiSecurity = "WPA",
  hidden: boolean = false
): string => {
  // Escapar caracteres especiales en SSID y password
  const escapeSpecialChars = (str: string): string => {
    return str.replace(/[\\;:,"]/g, (match) => `\\${match}`);
  };

  const escapedSSID = escapeSpecialChars(ssid);
  const escapedPassword = escapeSpecialChars(password);

  let wifiString = `WIFI:T:${security};S:${escapedSSID};`;
  
  if (security !== "nopass" && password) {
    wifiString += `P:${escapedPassword};`;
  }
  
  if (hidden) {
    wifiString += `H:true;`;
  }
  
  wifiString += `;`;
  
  return wifiString;
};

/**
 * Genera la URL final según el tipo
 * @param type - Tipo de QR (url, whatsapp, wifi o text)
 * @param url - URL o número de teléfono
 * @param message - Mensaje para WhatsApp (opcional)
 * @param wifiData - Datos de WiFi (opcional)
 * @param textContent - Contenido de texto plano (opcional)
 * @returns URL final o string según el tipo
 */
export const generateFinalUrl = (
  type: QRType,
  url: string,
  message?: string,
  wifiData?: {
    ssid: string;
    password: string;
    security: WiFiSecurity;
    hidden: boolean;
  },
  textContent?: string
): string => {
  if (type === "whatsapp") {
    return generateWhatsAppUrl(url, message);
  }
  if (type === "wifi" && wifiData) {
    return generateWiFiString(
      wifiData.ssid,
      wifiData.password,
      wifiData.security,
      wifiData.hidden
    );
  }
  if (type === "text" && textContent) {
    return textContent;
  }
  return url;
};

/**
 * Descarga una imagen ya generada (data URL), por ejemplo una entrada del historial.
 * Los códigos nuevos se descargan con `downloadQr` (src/lib/qr), que los vuelve a
 * renderizar en el formato elegido; esto solo cubre imágenes guardadas.
 * @param imageUrl - Data URL de la imagen
 * @param filename - Nombre del archivo (sin extensión)
 * @param extension - Extensión del archivo (jpg, png, pdf, svg)
 */
export const downloadImage = async (
  imageUrl: string,
  filename: string,
  extension: OutputFormat
): Promise<void> => {
  if (extension === "pdf") {
    const img = await loadImage(imageUrl);
    const { createImagePdfBlob } = await import("../lib/qr/pdf");
    saveBlob(
      await createImagePdfBlob(imageUrl, img.naturalWidth, img.naturalHeight),
      `${filename}.pdf`
    );
    return;
  }

  const a = document.createElement("a");
  a.href = imageUrl;
  a.download = `${filename}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
