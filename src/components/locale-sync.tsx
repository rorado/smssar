"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getDirection, isLocale, type Locale } from "@/lib/locales";

export function LocaleSync() {
  const pathname = usePathname();

  useEffect(() => {
    // Extract locale from pathname (e.g., "/ar/..." or "/en/...")
    const segments = pathname.split("/").filter(Boolean);
    const locale = segments[0];

    if (isLocale(locale)) {
      const dir = getDirection(locale as Locale);
      document.documentElement.dir = dir;
      document.documentElement.lang = locale;
    }
  }, [pathname]);

  return null;
}
