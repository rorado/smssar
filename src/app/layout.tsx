import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDirection, isLocale, type Locale } from "@/lib/locales";
import type { ReactNode } from "react";
import "./globals.css";

const themeScript = `(() => {
  try {
    const storageKey = "theme";
    const stored = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "dark" || stored === "light" ? stored : (prefersDark ? "dark" : "light");
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  } catch {}
})();`;

export const metadata: Metadata = {
  title: {
    default: "House Rental Platform",
    template: "%s | House Rental Platform",
  },
  description:
    "A premium multilingual house rental platform for users, sellers, and administrators.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-locale");
  const locale: Locale =
    headerLocale && isLocale(headerLocale) ? headerLocale : "en";
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-200">
        <ThemeToggle initialLocale={locale} />
        {children}
      </body>
    </html>
  );
}
