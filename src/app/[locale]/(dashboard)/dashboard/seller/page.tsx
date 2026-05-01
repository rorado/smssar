import { ArrowUpRight, BellRing, ChartColumnBig, House } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatGrid } from "@/components/stat-grid";
import { getMessages } from "@/lib/messages";
import { properties, sellerStats, plans } from "@/lib/site-data";
import { formatCompactNumber } from "@/lib/format";
import type { Locale } from "@/lib/locales";

export default async function SellerOverviewPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const listingCount = 3;
  const currentPlan = plans[0];
  const limitReached = listingCount >= 3;
  const recentListings = properties.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="accent">{locale === "ar" ? "نشط" : "Active"}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {messages.dashboard.seller.overview}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {locale === "ar"
              ? "راقب الأداء والإشعارات والعروض الجديدة."
              : "Track performance, leads, and new opportunities."}
          </p>
        </div>
        {limitReached ? (
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardContent className="flex items-center gap-3 p-4">
              <BellRing className="h-5 w-5 text-violet-500" />
              <div>
                <div className="font-medium">
                  {messages.dashboard.seller.limitNotice}
                </div>
                <div className="text-sm text-muted-foreground">
                  {messages.common.upgrade}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <StatGrid
        locale={locale}
        items={sellerStats.map((item) => ({
          label: item.label[locale],
          value: item.value,
          icon: <ChartColumnBig className="h-4 w-4" />,
        }))}
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{messages.dashboard.seller.listings}</CardTitle>
            <Link
              href={`/${locale}/dashboard/seller/listings`}
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-300"
            >
              {locale === "ar" ? "إدارة الكل" : "Manage all"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentListings.map((property) => (
              <div
                key={property.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{property.title[locale]}</div>
                  <div className="text-sm text-muted-foreground">
                    {property.city[locale]}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <House className="h-4 w-4" />
                  {formatCompactNumber(property.price, locale)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.dashboard.seller.plan}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-semibold">
              {currentPlan.title[locale]}
            </div>
            <div className="text-sm text-muted-foreground">
              {listingCount}/3 {messages.common.listingCount}
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              {currentPlan.description[locale]}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
