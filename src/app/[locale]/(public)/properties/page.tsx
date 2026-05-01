import { PropertyExplorer } from "@/components/property-explorer";
import { getMessages } from "@/lib/messages";
import { properties } from "@/lib/site-data";
import type { Locale } from "@/lib/locales";

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <PropertyExplorer
        locale={locale}
        properties={properties}
        title={messages.properties.title}
        subtitle={messages.properties.subtitle}
        noResults={messages.properties.noResults}
      />
    </div>
  );
}
