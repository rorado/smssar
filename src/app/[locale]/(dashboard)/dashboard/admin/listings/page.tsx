import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { properties } from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminListingsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.admin.listings}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "راجع القوائم المنشورة واحذف أو وافق عليها."
            : "Review listings, approve them, or flag issues."}
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{property.title[locale]}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {property.city[locale]}
                </p>
              </div>
              <Badge variant={property.featured ? "accent" : "secondary"}>
                {property.featured ? "Featured" : "Standard"}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {property.description[locale]}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
