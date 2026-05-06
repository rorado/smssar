import { AdminCitiesPanel } from "@/components/admin/admin-cities-panel";
import { getMessages } from "@/lib/messages";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/locales";

export default async function AdminCitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  const [cities, counts] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.property.groupBy({
      by: ["city"],
      _count: { city: true },
    }),
  ]);

  const countMap = new Map(counts.map((item) => [item.city, item._count.city]));
  const initialCities = cities.map((city) => ({
    ...city,
    propertyCount: countMap.get(city.name) ?? 0,
  }));

  const messages = getMessages(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.admin.cities}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "أنشئ المدن ونظمها من لوحة الإدارة."
            : "Create and organize cities from the admin dashboard."}
        </p>
      </div>

      <AdminCitiesPanel locale={locale} initialCities={initialCities} />
    </div>
  );
}
