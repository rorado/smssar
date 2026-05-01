import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getMessages } from "@/lib/messages";
import { plans, properties } from "@/lib/site-data";
import type { Locale } from "@/lib/locales";

export default async function SellerListingsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const listingCount = 3;
  const currentPlan = plans[0];
  const limitReached = listingCount >= Number(currentPlan.listings);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {messages.dashboard.seller.listings}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {locale === "ar"
              ? "أدر عقاراتك المنشورة وعدل حالتها فوراً."
              : "Manage your active homes and update them quickly."}
          </p>
        </div>
        <ButtonLink href={`/${locale}/dashboard/seller/add`} variant="accent">
          {messages.dashboard.seller.addHouse}
          <ArrowUpRight className="h-4 w-4" />
        </ButtonLink>
      </div>

      {limitReached ? (
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardContent className="p-4 text-sm font-medium text-violet-700 dark:text-violet-200">
            {messages.common.upgrade}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {properties.slice(0, listingCount).map((property) => (
          <Card key={property.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{property.title[locale]}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {property.city[locale]}
                </p>
              </div>
              <Badge variant={property.featured ? "accent" : "secondary"}>
                {property.featured
                  ? "Featured"
                  : locale === "ar"
                    ? "عادي"
                    : "Standard"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(property.price, locale)}</span>
                <span>
                  {property.rooms} {messages.common.rooms}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink
                  href={`/${locale}/dashboard/seller/listings/${property.id}/edit`}
                  variant="outline"
                  size="sm"
                >
                  <Pencil className="h-4 w-4" />
                  {messages.dashboard.seller.editHouse}
                </ButtonLink>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                  {locale === "ar" ? "حذف" : "Delete"}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
