"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locales";
import type { Messages } from "@/lib/messages";

export function SiteNavbar({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const [open, setOpen] = useState(false);

  const links = [
    ["properties", `/${locale}/properties`],
    ["pricing", `/${locale}/pricing`],
    ["seller", `/${locale}/dashboard/seller`],
    ["admin", `/${locale}/dashboard/admin`],
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base">House Rental Platform</div>
            <div className="text-xs text-muted-foreground">
              Premium marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {links.map(([key, href]) => (
            <Link
              key={key}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {messages.nav[key as keyof Messages["nav"]]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher currentLocale={locale} />
          <ButtonLink
            href={`/${locale}/properties`}
            variant="outline"
            size="sm"
          >
            <Search className="h-4 w-4" />
            {messages.nav.properties}
          </ButtonLink>
          <ButtonLink href={`/${locale}/login`} variant="secondary" size="sm">
            {messages.nav.login}
          </ButtonLink>
          <ButtonLink href={`/${locale}/register`} variant="accent" size="sm">
            <ShieldCheck className="h-4 w-4" />
            {messages.nav.register}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border/50 px-4 pb-4 sm:px-6 lg:px-8 xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="mx-auto max-w-7xl space-y-4 pt-4">
          <div className="flex flex-wrap gap-2">
            <LanguageSwitcher currentLocale={locale} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {links.map(([key, href]) => (
              <Link
                key={key}
                href={href}
                className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/70"
              >
                {messages.nav[key as keyof Messages["nav"]]}
              </Link>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <ButtonLink href={`/${locale}/login`} variant="secondary" size="md">
              {messages.nav.login}
            </ButtonLink>
            <ButtonLink href={`/${locale}/register`} variant="accent" size="md">
              {messages.nav.register}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
