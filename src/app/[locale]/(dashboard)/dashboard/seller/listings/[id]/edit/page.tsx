import { notFound } from "next/navigation";
import { ListingForm } from "@/components/listing-form";
import { properties } from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const messages = getMessages(locale);
  const listing = properties.find((item) => item.id === id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.seller.editHouse}
        </h1>
        <p className="mt-2 text-muted-foreground">{listing.title[locale]}</p>
      </div>
      <ListingForm
        locale={locale}
        title={messages.dashboard.seller.editHouse}
        defaultListing={listing}
      />
    </div>
  );
}
