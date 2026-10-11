import { QR_TYPES, QR_TYPE_LIST, type QRType, type QrSlug } from "./qrTypes";

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

/** URL segment of a generator page. Derived from the registry in `qrTypes.ts`. */
export type GeneratorRouteType = QrSlug;

export const GENERATOR_ROUTE_TYPES: GeneratorRouteType[] = QR_TYPES.map((entry) => entry.slug);

/** Mapeo ruta URL → tipo interno del formulario (QRType). */
export const ROUTE_TO_TYPE = Object.fromEntries(QR_TYPE_LIST.map((entry) => [entry.slug, entry.id])) as Record<
  GeneratorRouteType,
  QRType
>;

/** Mapeo tipo interno (QRType) → segmento de ruta. */
export const TYPE_TO_ROUTE = Object.fromEntries(QR_TYPE_LIST.map((entry) => [entry.id, entry.slug])) as Record<
  QRType,
  GeneratorRouteType
>;

export interface PageMeta {
  title: string;
  description: string;
}

/** Títulos de hasta 60 caracteres (palabra clave primero) y descripciones de 140 a 160. Viven en el registro. */
export const GENERATOR_ROUTE_META = Object.fromEntries(QR_TYPE_LIST.map((entry) => [entry.slug, entry.meta])) as Record<
  GeneratorRouteType,
  PageMeta
>;

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
