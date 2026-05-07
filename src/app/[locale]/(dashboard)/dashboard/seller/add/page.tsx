import { ListingForm } from "@/components/property/listing-form";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { prisma } from "@/lib/prisma";

export default async function SellerAddPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  const [categories, cities] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.city.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const uniqueCities = cities.map((city) => city.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.seller.addHouse}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "أنشئ عقاراً جديداً مع صور ومزايا وخطة اشتراك مناسبة."
            : "Create a new listing with photos, amenities, and plan-aware limits."}
        </p>
      </div>
      <ListingForm
        locale={locale}
        title={messages.dashboard.seller.addHouse}
        categories={categories}
        cities={uniqueCities}
      />
    </div>
  );
}
