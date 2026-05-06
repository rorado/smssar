import type { Locale } from "@/lib/locales";

export type LocaleText = {
  en: string;
  ar: string;
  fr: string;
};

export const translate = (locale: Locale, text: LocaleText) =>
  text[locale] ?? text.en;
