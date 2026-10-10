/** Base URL del sitio (sin barra final). Usado para canonical y sitemap. */
export const SITE_URL = "https://www.qrgratis.es";

/** Nombre de la marca, usado al final de cada título. */
export const PROJECT_NAME = "QR Gratis";

/** Imagen para Open Graph y Twitter (archivo en `public/`, 1200x630). */
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "QR Gratis: generador de códigos QR gratis, sin registro y sin caducidad",
} as const;

/** Valor de `og:locale` según el idioma activo de la interfaz. */
export const OG_LOCALES: Record<string, string> = {
  es: "es_ES",
  en: "en_US",
  pt: "pt_BR",
};

export type GeneratorRouteType = "url" | "whatsapp" | "wifi" | "texto";

export const GENERATOR_ROUTE_TYPES: GeneratorRouteType[] = ["url", "whatsapp", "wifi", "texto"];

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

export interface PageMeta {
  title: string;
  description: string;
}

/** Títulos de hasta 60 caracteres (palabra clave primero) y descripciones de 140 a 160. */
export const GENERATOR_ROUTE_META: Record<GeneratorRouteType, PageMeta> = {
  url: {
    title: `Generador de código QR para URL gratis | ${PROJECT_NAME}`,
    description:
      "Convierte cualquier enlace en un código QR gratis. Elige color, tamaño y logo, y descárgalo en PNG, JPG, SVG o PDF. Sin registro y sin caducidad.",
  },
  whatsapp: {
    title: `Código QR de WhatsApp gratis con mensaje | ${PROJECT_NAME}`,
    description:
      "Crea un código QR que abre un chat de WhatsApp con tu número y un mensaje ya escrito. Gratis, sin registro y sin caducidad. Descárgalo en segundos.",
  },
  wifi: {
    title: `Código QR para WiFi gratis: comparte tu red | ${PROJECT_NAME}`,
    description:
      "Crea un código QR para que tus invitados o clientes se conecten a tu WiFi sin escribir la contraseña. Gratis, sin registro, sin anuncios y sin caducidad.",
  },
  texto: {
    title: `Código QR de texto gratis | ${PROJECT_NAME}`,
    description:
      "Convierte un texto en un código QR gratis: notas, instrucciones o códigos de inventario. Sin registro, sin anuncios y sin caducidad. PNG, JPG, SVG o PDF.",
  },
};

/** SEO for the home page ("/"). */
export const HOME_META: PageMeta = {
  title: `Generador de códigos QR gratis, sin registro | ${PROJECT_NAME}`,
  description:
    "Crea códigos QR gratis para enlaces, WhatsApp, WiFi y texto. Sin registro, sin anuncios y sin fecha de caducidad. Descarga en PNG, JPG, SVG o PDF.",
};

/** Baseline SEO for non-generator public pages, keyed by pathname. */
export const STATIC_PAGE_META: Record<string, PageMeta> = {
  "/faq": {
    title: `Preguntas frecuentes sobre códigos QR | ${PROJECT_NAME}`,
    description:
      "Respuestas claras sobre códigos QR gratis: si caducan, qué formatos puedes descargar, qué datos guardamos y cómo imprimirlos para que se lean bien.",
  },
  "/about": {
    title: `Sobre nosotros | ${PROJECT_NAME}`,
    description:
      "Conoce QR Gratis: un generador de códigos QR de código abierto, sin registro ni anuncios. Te contamos quién lo hace, por qué existe y cómo funciona.",
  },
  "/donaciones": {
    title: `Apoya el proyecto: donaciones | ${PROJECT_NAME}`,
    description:
      "QR Gratis es gratis y no tiene anuncios. Si te sirvió, puedes apoyar el proyecto con una donación voluntaria. No es obligatorio y se agradece mucho.",
  },
  "/terms": {
    title: `Términos y condiciones de uso | ${PROJECT_NAME}`,
    description:
      "Condiciones de uso de QR Gratis: puedes usar el generador para fines personales y comerciales. Revisa tus responsabilidades sobre el contenido de tus códigos.",
  },
  "/privacy": {
    title: `Política de privacidad | ${PROJECT_NAME}`,
    description:
      "Qué datos usa QR Gratis y cuáles no: el código se crea en tu dispositivo y su contenido no se envía a ningún servidor, tu historial queda en tu navegador y Google Analytics solo cuenta visitas.",
  },
  "/cookies": {
    title: `Política de cookies | ${PROJECT_NAME}`,
    description:
      "Qué cookies y almacenamiento local usa QR Gratis: preferencias de idioma y tema, y Google Analytics para medir visitas. Cómo bloquearlas desde tu navegador.",
  },
};
