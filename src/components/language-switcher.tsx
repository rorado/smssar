"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { locales, type Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

function buildLocalizedPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (locales.includes(segments[0] as Locale)) {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }

  return `/${nextLocale}/${segments.join("/")}`;
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = useMemo(
    () => (currentLocale === "en" ? "ar" : "en"),
    [currentLocale],
  );

  const switchLocale = (locale: Locale) => {
    localStorage.setItem("locale", locale);
    router.replace(buildLocalizedPath(pathname, locale));
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border/80 bg-background p-1 shadow-sm">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition",
            currentLocale === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
      <span className="sr-only">
        Current alternate language: {otherLocale.toUpperCase()}
      </span>
    </div>
  );
}
