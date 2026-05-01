import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Ruler,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { getMessages } from "@/lib/messages";
import { properties } from "@/lib/site-data";
import type { Locale } from "@/lib/locales";
import type { ReactNode } from "react";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const messages = getMessages(locale);
  const property = properties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/properties`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {locale === "ar" ? "العودة إلى العقارات" : "Back to properties"}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-border/70">
          <div
            className={`relative h-80 bg-linear-to-br ${property.palette[0]} ${property.palette[1]}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_33%),linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0.5))]" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap gap-2">
                {property.featured ? (
                  <Badge variant="accent">Featured</Badge>
                ) : null}
                <Badge variant="secondary" className="bg-white/15 text-white">
                  {property.city[locale]}
                </Badge>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
                {property.title[locale]}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-white/85">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {property.city[locale]}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4" /> {property.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <CardContent className="space-y-8 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric
                icon={<BedDouble className="h-4 w-4" />}
                label={messages.common.rooms}
                value={`${property.rooms}`}
              />
              <Metric
                icon={<Bath className="h-4 w-4" />}
                label={messages.properties.bath}
                value={`${property.bathrooms}`}
              />
              <Metric
                icon={<Ruler className="h-4 w-4" />}
                label={messages.properties.size}
                value={`${property.area} m²`}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {messages.common.description}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {property.description[locale]}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {messages.common.amenities}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge
                    key={`${property.id}-amenity-${index}`}
                    variant="outline"
                    className="bg-muted/30"
                  >
                    {amenity[locale]}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{messages.properties.sellerCard}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ar" ? "اسم البائع" : "Seller"}
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {property.seller}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                {locale === "ar"
                  ? "بائع موثق مع استجابة سريعة"
                  : "Verified seller with fast response"}
              </div>
              <ButtonLink
                href={`/${locale}/login`}
                variant="accent"
                className="w-full"
              >
                {messages.common.contactSeller}
                <Heart className="h-4 w-4" />
              </ButtonLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{messages.common.overview}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <InfoRow
                label={messages.common.price}
                value={formatCurrency(property.price, locale)}
              />
              <InfoRow
                label={messages.properties.location}
                value={property.city[locale]}
              />
              <InfoRow
                label={messages.common.inquiries}
                value={`${property.inquiries}`}
              />
              <InfoRow
                label={locale === "ar" ? "نوع العقار" : "Property type"}
                value={property.category}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/30 px-4 py-3">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
