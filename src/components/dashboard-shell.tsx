"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  Menu,
  PanelLeftClose,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locales";
import type { ReactNode } from "react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export function DashboardShell({
  locale,
  title,
  roleLabel,
  items,
  children,
}: {
  locale: Locale;
  title: string;
  roleLabel: string;
  items: DashboardNavItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside
          className={cn(
            "border-border/60 bg-card/90 backdrop-blur-xl lg:border-r",
            open ? "fixed inset-y-0 z-40 w-70 lg:static" : "hidden lg:block",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-3 font-semibold"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div>{title}</div>
                  <div className="text-xs text-muted-foreground">
                    {roleLabel}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="lg:hidden"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border/60 p-4">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> {locale.toUpperCase()}
                </span>
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <div className="text-lg font-semibold">{title}</div>
                  <div className="text-sm text-muted-foreground">
                    {roleLabel}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
