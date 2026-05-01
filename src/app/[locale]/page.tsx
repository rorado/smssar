import type { Locale } from "@/lib/locales";
import LandingPage from "./landing-page";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <LandingPage locale={locale} />;
}