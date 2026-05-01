import type { ReactNode } from "react";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const messages = getMessages(locale);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar locale={locale} messages={messages} />
      <main>{children}</main>
      <SiteFooter locale={locale} messages={messages} />
    </div>
  );
}
