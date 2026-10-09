import type { TFunction } from "i18next";

export interface FaqItem {
  q: string;
  a: string;
}

export interface TextItem {
  title: string;
  text: string;
}

/** Reads an array stored in the locale files; returns [] if the key is missing or not an array. */
export function getList<T>(t: TFunction, key: string): T[] {
  const value = t(key, { returnObjects: true }) as unknown;
  return Array.isArray(value) ? (value as T[]) : [];
}
