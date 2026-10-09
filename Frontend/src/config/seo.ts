/** Base URL del sitio (sin barra final). Usado para canonical y sitemap. */
export const SITE_URL = "https://www.qrgratis.es";

/** Nombre del proyecto para títulos (fallback). */
export const PROJECT_NAME = "Generador QR";

export type GeneratorRouteType = "url" | "whatsapp" | "wifi" | "texto";

/** Mapeo ruta URL → tipo interno del formulario (QRType). */
export const ROUTE_TO_TYPE: Record<GeneratorRouteType, "url" | "whatsapp" | "wifi" | "text"> = {
  url: "url",
  whatsapp: "whatsapp",
  wifi: "wifi",
  texto: "text",
};

/** Mapeo tipo interno (QRType) → segmento de ruta. */
export const TYPE_TO_ROUTE: Record<"url" | "whatsapp" | "wifi" | "text", GeneratorRouteType> = {
  url: "url",
  whatsapp: "whatsapp",
  wifi: "wifi",
  text: "texto",
};

export const GENERATOR_ROUTE_META: Record<
  GeneratorRouteType,
  { title: string; description: string }
> = {
  url: {
    title: `Generador de Código QR para URLs gratis | ${PROJECT_NAME}`,
    description:
      "Crea códigos QR para cualquier enlace o URL en segundos. Personaliza tamaño, color y descarga en PNG, JPG, SVG o PDF. Gratis y sin registro.",
  },
  whatsapp: {
    title: `Generador de QR para WhatsApp gratis | ${PROJECT_NAME}`,
    description:
      "Genera un código QR que abre WhatsApp directo con tu número y mensaje. Ideal para negocios y emprendedores. Sin registro.",
  },
  wifi: {
    title: `Generador de QR para WiFi gratis | ${PROJECT_NAME}`,
    description:
      "Crea un código QR para compartir tu red WiFi fácilmente. Compatible con WPA, WPA2 y WEP. Descarga gratis al instante.",
  },
  texto: {
    title: `Generador de QR para Texto gratis | ${PROJECT_NAME}`,
    description:
      "Convierte cualquier texto en un código QR al instante. Personaliza y descarga en múltiples formatos. 100% gratis.",
  },
};

/** SEO for the home page ("/"). */
export const HOME_META: { title: string; description: string } = {
  title: "Generador de códigos QR gratis: sin registro y sin caducidad | QR Gratis",
  description:
    "Crea códigos QR gratis para URL, WhatsApp, WiFi y texto. Sin registro, sin anuncios y sin caducidad: tu QR funciona siempre. Descarga en PNG, JPG, SVG o PDF.",
};

/** Baseline SEO for non-generator public pages, keyed by pathname. */
export const STATIC_PAGE_META: Record<string, { title: string; description: string }> = {
  "/faq": {
    title: `Preguntas frecuentes sobre el generador de QR | ${PROJECT_NAME}`,
    description:
      "Resuelve tus dudas sobre cómo crear códigos QR gratis: formatos de descarga, logos, caducidad, privacidad y más.",
  },
  "/about": {
    title: `Sobre nosotros | ${PROJECT_NAME}`,
    description:
      "Conoce el proyecto detrás del generador de códigos QR gratuito: quién lo crea, por qué existe y cómo funciona.",
  },
  "/donaciones": {
    title: `Apoya el proyecto: donaciones | ${PROJECT_NAME}`,
    description:
      "El generador de QR es gratis y sin anuncios. Si te resulta útil, puedes apoyar el proyecto con una donación voluntaria.",
  },
  "/terms": {
    title: `Términos y condiciones de uso | ${PROJECT_NAME}`,
    description: "Condiciones de uso del generador de códigos QR gratuito.",
  },
  "/privacy": {
    title: `Política de privacidad | ${PROJECT_NAME}`,
    description:
      "Cómo tratamos tus datos al usar el generador de códigos QR: qué se procesa, qué se guarda y qué no.",
  },
  "/cookies": {
    title: `Política de cookies | ${PROJECT_NAME}`,
    description: "Información sobre las cookies y el almacenamiento local que usa el generador de códigos QR.",
  },
};
