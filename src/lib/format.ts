import type { Locale } from "@/lib/locales";

function toIntlLocale(locale: Locale | string) {
  return locale === "ar" ? "ar-MA" : "en-MA";
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(toIntlLocale(locale)).format(value);
}
