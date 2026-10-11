import {
  Link2,
  MessageCircle,
  Wifi,
  FileText,
  UtensilsCrossed,
  Star,
  Share2,
  ShoppingBag,
  Store,
  CreditCard,
  Package,
  Headset,
  Coffee,
  KeyRound,
  Briefcase,
  Home,
  ClipboardList,
  CalendarDays,
  Boxes,
  Gift,
  Receipt,
  Contact,
  Users,
  Mail,
  MapPin,
  MapPinned,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { FieldValues, ValidationResult } from "../types";
import {
  buildEmailPayload,
  buildGoogleReviewsPayload,
  buildLocationPayload,
  buildVCardPayload,
  validateEmail,
  validateGoogleReviews,
  validateLocation,
  validateVCard,
} from "../utils/qrPayloads";

/**
 * QR type registry: the single place that describes every generator page.
 *
 * To add a type (the F1b recipe):
 *  1. Append one entry to `QR_TYPES` below: `slug` (URL segment), `id` (internal type), icons,
 *     `navKey`, `meta` (Spanish title/description) and, for a field-driven form, a `form` with
 *     `fields`, `buildPayload` and `validate` (put the pure logic in `utils/qrPayloads.ts`).
 *  2. Add the copy to `src/i18n/locales/{es,en,pt}.json`: `landing.types.<slug>` (page content),
 *     `landing.home.types.cards.<slug>` (home card), `header.nav.*` (the `navKey`) and, for
 *     forms, `form.types.<slug>.{fields,errors,warnings}` (see `fieldKey`).
 * Routing, prerender + sitemap (`PRERENDER_ROUTES`), tabs, header "Más tipos" menu, footer, home
 * cards, related types and SEO meta all read from this list, so no other file needs to change.
 *
 * The first four types predate the registry and keep their bespoke forms and payload code
 * (`form` undefined); they only contribute metadata.
 */

export interface QrTypeMeta {
  title: string;
  description: string;
}

export type FieldKind = "text" | "url" | "email" | "tel" | "textarea" | "choice";

export interface FieldDef {
  /** Key in the type's values object, also part of the i18n key and the element id. */
  name: string;
  kind: FieldKind;
  /** Two fields in a row on wider screens. Default is full width. */
  width?: "half";
  /** Consecutive fields sharing a group are wrapped in a fieldset titled `form.types.<slug>.groups.<group>`. */
  group?: string;
  autoComplete?: string;
  rows?: number;
  /** Translated at `form.types.<slug>.fields.<name>.placeholder` / `.hint` when true. */
  placeholder?: boolean;
  hint?: boolean;
  /** `choice` only: option values, labelled at `fields.<name>.options.<value>`. The first is the default. */
  options?: readonly string[];
  defaultValue?: string;
  /** Hide the field (and skip its error) unless this returns true. */
  visibleWhen?: (values: FieldValues) => boolean;
}

export interface FormSpec {
  fields: readonly FieldDef[];
  /** Text encoded in the QR. Only called with values that have no validation errors. */
  buildPayload: (values: FieldValues) => string;
  validate: (values: FieldValues) => ValidationResult;
}

export interface QrTypeDefinition {
  /** Internal type used by the generator state. */
  id: string;
  /** URL segment: `/generador-qr/<slug>`. Also the key in `landing.types.<slug>`. */
  slug: string;
  icon: LucideIcon;
  /** One icon per use case in `landing.types.<slug>.useCases.items` (same order). */
  useCaseIcons: readonly LucideIcon[];
  /** i18n key of the short label used in tabs, header and footer. */
  navKey: string;
  /** `main` types sit in the header bar; `more` types go in the "Más tipos" menu. */
  navGroup: "main" | "more";
  /** Preferred slugs for the "other types" section; the rest is filled from registry order. */
  related?: readonly string[];
  meta: QrTypeMeta;
  /** Field-driven form. Omit for the legacy types with bespoke forms. */
  form?: FormSpec;
}

const BRAND = "QR Gratis";

export const QR_TYPES = [
  {
    id: "url",
    slug: "url",
    icon: Link2,
    useCaseIcons: [UtensilsCrossed, Star, Share2, ShoppingBag],
    navKey: "header.nav.url",
    navGroup: "main",
    meta: {
      title: `Generador de código QR para URL gratis | ${BRAND}`,
      description:
        "Convierte cualquier enlace en un código QR gratis. Elige color, tamaño y logo, y descárgalo en PNG, JPG, SVG o PDF. Sin registro y sin caducidad.",
    },
  },
  {
    id: "whatsapp",
    slug: "whatsapp",
    icon: MessageCircle,
    useCaseIcons: [Store, CreditCard, Package, Headset],
    navKey: "header.nav.whatsapp",
    navGroup: "main",
    meta: {
      title: `Código QR de WhatsApp gratis con mensaje | ${BRAND}`,
      description:
        "Crea un código QR que abre un chat de WhatsApp con tu número y un mensaje ya escrito. Gratis, sin registro y sin caducidad. Descárgalo en segundos.",
    },
  },
  {
    id: "wifi",
    slug: "wifi",
    icon: Wifi,
    useCaseIcons: [Coffee, KeyRound, Briefcase, Home],
    navKey: "header.nav.wifi",
    navGroup: "main",
    meta: {
      title: `Código QR para WiFi gratis: comparte tu red | ${BRAND}`,
      description:
        "Crea un código QR para que tus invitados o clientes se conecten a tu WiFi sin escribir la contraseña. Gratis, sin registro, sin anuncios y sin caducidad.",
    },
  },
  {
    id: "text",
    slug: "texto",
    icon: FileText,
    useCaseIcons: [ClipboardList, CalendarDays, Boxes, Gift],
    navKey: "header.nav.text",
    navGroup: "main",
    meta: {
      title: `Código QR de texto gratis | ${BRAND}`,
      description:
        "Convierte un texto en un código QR gratis: notas, instrucciones o códigos de inventario. Sin registro, sin anuncios y sin caducidad. PNG, JPG, SVG o PDF.",
    },
  },
  {
    id: "resenas-google",
    slug: "resenas-google",
    icon: Star,
    useCaseIcons: [Store, UtensilsCrossed, Receipt, CreditCard],
    navKey: "header.nav.resenasGoogle",
    navGroup: "more",
    related: ["url", "ubicacion", "whatsapp", "email", "vcard", "wifi"],
    meta: {
      title: `QR para reseñas de Google gratis | ${BRAND}`,
      description:
        "Crea un código QR que lleva a tus clientes a dejar una reseña de tu negocio en Google. Pega tu enlace, descarga e imprime. Gratis, sin registro y sin caducidad.",
    },
    form: {
      fields: [{ name: "link", kind: "url", placeholder: true, hint: true, autoComplete: "off" }],
      buildPayload: buildGoogleReviewsPayload,
      validate: validateGoogleReviews,
    },
  },
  {
    id: "vcard",
    slug: "vcard",
    icon: Contact,
    useCaseIcons: [CreditCard, Users, Mail, Store],
    navKey: "header.nav.vcard",
    navGroup: "more",
    related: ["email", "whatsapp", "url", "ubicacion", "resenas-google", "texto"],
    meta: {
      title: `QR de tarjeta de contacto (vCard) gratis | ${BRAND}`,
      description:
        "Crea un código QR de tarjeta de contacto (vCard) con tu nombre, teléfono, email y web. Quien lo escanee te guarda en su agenda. Gratis y sin registro.",
    },
    form: {
      fields: [
        { name: "firstName", kind: "text", width: "half", placeholder: true, autoComplete: "given-name" },
        { name: "lastName", kind: "text", width: "half", placeholder: true, autoComplete: "family-name" },
        { name: "company", kind: "text", width: "half", placeholder: true, autoComplete: "organization" },
        { name: "jobTitle", kind: "text", width: "half", placeholder: true, autoComplete: "organization-title" },
        { name: "mobile", kind: "tel", width: "half", placeholder: true, autoComplete: "tel" },
        { name: "phoneWork", kind: "tel", width: "half", placeholder: true, autoComplete: "tel" },
        { name: "email", kind: "email", width: "half", placeholder: true, autoComplete: "email" },
        { name: "website", kind: "url", width: "half", placeholder: true, autoComplete: "url" },
        { name: "street", kind: "text", group: "address", placeholder: true, autoComplete: "street-address" },
        { name: "city", kind: "text", group: "address", width: "half", placeholder: true, autoComplete: "address-level2" },
        { name: "postalCode", kind: "text", group: "address", width: "half", placeholder: true, autoComplete: "postal-code" },
        { name: "country", kind: "text", group: "address", placeholder: true, autoComplete: "country-name" },
        { name: "note", kind: "textarea", rows: 3, placeholder: true, autoComplete: "off" },
      ],
      buildPayload: buildVCardPayload,
      validate: validateVCard,
    },
  },
  {
    id: "ubicacion",
    slug: "ubicacion",
    icon: MapPin,
    useCaseIcons: [Store, CalendarDays, MapPinned, Home],
    navKey: "header.nav.ubicacion",
    navGroup: "more",
    related: ["url", "vcard", "resenas-google", "whatsapp", "email", "texto"],
    meta: {
      title: `Código QR de ubicación de Google Maps gratis | ${BRAND}`,
      description:
        "Crea un código QR que abre una dirección o unas coordenadas en Google Maps. Útil para tiendas y eventos. Gratis, sin registro y sin caducidad.",
    },
    form: {
      fields: [
        { name: "mode", kind: "choice", options: ["address", "coords"] },
        {
          name: "address",
          kind: "text",
          placeholder: true,
          hint: true,
          autoComplete: "street-address",
          visibleWhen: (values) => values.mode !== "coords",
        },
        {
          name: "lat",
          kind: "text",
          width: "half",
          placeholder: true,
          autoComplete: "off",
          visibleWhen: (values) => values.mode === "coords",
        },
        {
          name: "lng",
          kind: "text",
          width: "half",
          placeholder: true,
          autoComplete: "off",
          visibleWhen: (values) => values.mode === "coords",
        },
      ],
      buildPayload: buildLocationPayload,
      validate: validateLocation,
    },
  },
  {
    id: "email",
    slug: "email",
    icon: Mail,
    useCaseIcons: [ClipboardList, Headset, MessageSquare, Briefcase],
    navKey: "header.nav.email",
    navGroup: "more",
    related: ["vcard", "whatsapp", "url", "resenas-google", "texto", "ubicacion"],
    meta: {
      title: `Código QR de email gratis con asunto y mensaje | ${BRAND}`,
      description:
        "Crea un código QR que abre un correo con tu dirección, el asunto y el mensaje ya escritos. Ideal para presupuestos. Gratis, sin registro y sin caducidad.",
    },
    form: {
      fields: [
        { name: "to", kind: "email", placeholder: true, autoComplete: "email" },
        { name: "subject", kind: "text", placeholder: true, autoComplete: "off" },
        { name: "body", kind: "textarea", rows: 4, placeholder: true, autoComplete: "off" },
      ],
      buildPayload: buildEmailPayload,
      validate: validateEmail,
    },
  },
] as const satisfies readonly QrTypeDefinition[];

type Registry = (typeof QR_TYPES)[number];

/** Internal type ids ("url", "whatsapp", "wifi", "text", "resenas-google", ...). */
export type QRType = Registry["id"];
/** URL segments ("url", "whatsapp", "wifi", "texto", "resenas-google", ...). */
export type QrSlug = Registry["slug"];

/** The registry viewed through the wide interface (the `as const` literals are only needed for the unions above). */
export const QR_TYPE_LIST: readonly QrTypeDefinition[] = QR_TYPES;
const ENTRIES = QR_TYPE_LIST;

export const getQrTypeBySlug = (slug: string): QrTypeDefinition | undefined =>
  ENTRIES.find((entry) => entry.slug === slug);

export const getQrTypeById = (id: string): QrTypeDefinition => {
  const entry = ENTRIES.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Unknown QR type: ${id}`);
  return entry;
};

/** Types shown directly in the header bar. */
export const MAIN_NAV_TYPES: readonly QrTypeDefinition[] = ENTRIES.filter((entry) => entry.navGroup === "main");

/** Types listed in the header "Más tipos" menu. */
export const MORE_NAV_TYPES: readonly QrTypeDefinition[] = ENTRIES.filter((entry) => entry.navGroup === "more");

/**
 * Up to `max` types related to `slug`: the curated `related` list first, then the remaining
 * types in registry order starting after `slug` (so neighbouring pages link to different sets).
 */
export const getRelatedTypes = (slug: string, max = 6): QrTypeDefinition[] => {
  const current = ENTRIES.findIndex((entry) => entry.slug === slug);
  const rotated = current === -1 ? [...ENTRIES] : [...ENTRIES.slice(current + 1), ...ENTRIES.slice(0, current)];
  const curated = (getQrTypeBySlug(slug)?.related ?? [])
    .map((relatedSlug) => rotated.find((entry) => entry.slug === relatedSlug))
    .filter((entry): entry is QrTypeDefinition => entry !== undefined);
  const rest = rotated.filter((entry) => !curated.includes(entry));
  return [...curated, ...rest].slice(0, max);
};

/** i18n key for a field label/placeholder/hint/option, e.g. `form.types.vcard.fields.email.label`. */
export const fieldKey = (slug: string, name: string, part: "label" | "placeholder" | "hint" | `options.${string}`): string =>
  `form.types.${slug}.fields.${name}.${part}`;
