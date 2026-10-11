import type { FieldValues, ValidationResult } from "../types";

/**
 * Payload builders and validators for the field-driven QR types (see `config/qrTypes.ts`).
 * Everything here is pure: values in, payload text or validation codes out. Error and
 * warning values are codes; the UI translates them from
 * `form.types.<slug>.errors.<code>` / `form.types.<slug>.warnings.<code>`.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

const read = (values: FieldValues, name: string): string => (values[name] ?? "").trim();

const result = (): ValidationResult => ({ errors: {}, warnings: {} });

/* ------------------------------------------------------------------ Google reviews */

/** google.<tld>, google.com.<cc>, g.page, goo.gl (incl. maps.app.goo.gl) and g.co, with any subdomain. */
const GOOGLE_HOST_PATTERN = /^(?:[a-z0-9-]+\.)*(?:google\.[a-z]{2,3}(?:\.[a-z]{2})?|g\.page|goo\.gl|g\.co)$/i;

export const isGoogleHost = (hostname: string): boolean => GOOGLE_HOST_PATTERN.test(hostname);

export const validateGoogleReviews = (values: FieldValues): ValidationResult => {
  const out = result();
  const link = read(values, "link");
  if (!link) {
    out.errors.link = "required";
    return out;
  }
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    out.errors.link = "invalid";
    return out;
  }
  if (url.protocol !== "https:") {
    out.errors.link = "invalid";
    return out;
  }
  if (!isGoogleHost(url.hostname)) out.warnings.link = "notGoogle";
  return out;
};

/** The payload is the link the owner pasted; nothing is constructed from a Place ID. */
export const buildGoogleReviewsPayload = (values: FieldValues): string => read(values, "link");

/* ------------------------------------------------------------------ vCard 3.0 */

/** RFC 2426 text escaping: backslash, semicolon, comma and line breaks. */
export const escapeVCardText = (value: string): string =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");

const withScheme = (website: string): string => (/^[a-z][a-z0-9+.-]*:/i.test(website) ? website : `https://${website}`);

export const validateVCard = (values: FieldValues): ValidationResult => {
  const out = result();
  if (!read(values, "firstName") && !read(values, "company")) out.errors.firstName = "nameOrCompany";
  const email = read(values, "email");
  if (email && !isValidEmail(email)) out.errors.email = "invalidEmail";
  return out;
};

export const buildVCardPayload = (values: FieldValues): string => {
  const firstName = read(values, "firstName");
  const lastName = read(values, "lastName");
  const company = read(values, "company");
  const jobTitle = read(values, "jobTitle");
  const mobile = read(values, "mobile");
  const phoneWork = read(values, "phoneWork");
  const email = read(values, "email");
  const website = read(values, "website");
  const street = read(values, "street");
  const city = read(values, "city");
  const postalCode = read(values, "postalCode");
  const country = read(values, "country");
  const note = read(values, "note");

  const text = escapeVCardText;
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || company;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    // N is mandatory in vCard 3.0, so it is always present even when only a company was given.
    `N:${text(lastName)};${text(firstName)};;;`,
    `FN:${text(fullName)}`,
  ];
  if (company) lines.push(`ORG:${text(company)}`);
  if (jobTitle) lines.push(`TITLE:${text(jobTitle)}`);
  if (mobile) lines.push(`TEL;TYPE=CELL:${text(mobile)}`);
  if (phoneWork) lines.push(`TEL;TYPE=WORK:${text(phoneWork)}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${text(email)}`);
  // URI values are not text: commas and semicolons are part of the address, only line breaks are removed.
  if (website) lines.push(`URL:${withScheme(website).replace(/[\r\n]+/g, "")}`);
  if (street || city || postalCode || country) {
    lines.push(`ADR;TYPE=WORK:;;${text(street)};${text(city)};;${text(postalCode)};${text(country)}`);
  }
  if (note) lines.push(`NOTE:${text(note)}`);
  lines.push("END:VCARD");

  return `${lines.join("\r\n")}\r\n`;
};

/* ------------------------------------------------------------------ Location */

const COORDINATE_PATTERN = /^[+-]?\d+(?:\.\d+)?$/;

/** Accepts "40.4168" and the Spanish "40,4168"; returns null when it is not a plain decimal number. */
export const parseCoordinate = (raw: string): number | null => {
  const normalized = raw.trim().replace(",", ".");
  if (!COORDINATE_PATTERN.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
};

const locationMode = (values: FieldValues): "address" | "coords" => (values.mode === "coords" ? "coords" : "address");

export const validateLocation = (values: FieldValues): ValidationResult => {
  const out = result();
  if (locationMode(values) === "address") {
    if (!read(values, "address")) out.errors.address = "addressRequired";
    return out;
  }
  const axes = [
    { name: "lat", limit: 90 },
    { name: "lng", limit: 180 },
  ];
  for (const { name, limit } of axes) {
    const raw = read(values, name);
    if (!raw) {
      out.errors[name] = `${name}Required`;
      continue;
    }
    const value = parseCoordinate(raw);
    if (value === null) out.errors[name] = `${name}Invalid`;
    else if (Math.abs(value) > limit) out.errors[name] = `${name}Range`;
  }
  return out;
};

/** Official Google Maps URL: opens the Maps app when installed and the browser otherwise (also on iPhone). */
export const buildLocationPayload = (values: FieldValues): string => {
  const query =
    locationMode(values) === "coords"
      ? `${parseCoordinate(read(values, "lat"))},${parseCoordinate(read(values, "lng"))}`
      : read(values, "address");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

/* ------------------------------------------------------------------ Email */

export const validateEmail = (values: FieldValues): ValidationResult => {
  const out = result();
  const to = read(values, "to");
  if (!to) out.errors.to = "toRequired";
  else if (!isValidEmail(to)) out.errors.to = "toInvalid";
  return out;
};

export const buildEmailPayload = (values: FieldValues): string => {
  const params: string[] = [];
  const subject = read(values, "subject");
  const body = values.body?.trim() ?? "";
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${read(values, "to")}${params.length > 0 ? `?${params.join("&")}` : ""}`;
};
