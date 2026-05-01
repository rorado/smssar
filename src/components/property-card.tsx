import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Heart,
  MapPin,
  Ruler,
} from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { Locale } from "@/lib/locales";
import type { Property } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PropertyCard({
  locale,
  property,
}: {
  locale: Locale;
  property: Property;
}) {
  const isArabic = locale === "ar";

  return (
    <Card className="group overflow-hidden border-border/70 bg-card transition hover:-translate-y-1 hover:shadow-2xl">
      <div
        className={cn(
          "relative h-56 overflow-hidden bg-linear-to-br",
          property.palette[0],
          property.palette[1],
        )}
      >
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title[locale]}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={false}
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.46))]" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {property.featured ? <Badge variant="accent">Featured</Badge> : null}
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {property.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <div className="flex items-center gap-2 text-sm/none text-white/85">
              <MapPin className="h-4 w-4" />
              <span>{property.city[locale]}</span>
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              {property.title[locale]}
            </h3>
          </div>
          <div className="rounded-full bg-white/15 p-3 backdrop-blur">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>
      <CardContent className="space-y-5 p-6">
        <p className="text-sm leading-6 text-muted-foreground">
          {property.description[locale]}
        </p>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <Meta
            icon={<BedDouble className="h-4 w-4" />}
            label={property.rooms.toString()}
            caption={isArabic ? "غرف" : "rooms"}
          />
          <Meta
            icon={<Bath className="h-4 w-4" />}
            label={property.bathrooms.toString()}
            caption={isArabic ? "حمامات" : "baths"}
          />
          <Meta
            icon={<Ruler className="h-4 w-4" />}
            label={`${property.area}`}
            caption={isArabic ? "م²" : "sqm"}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge
              key={`${property.id}-amenity-${index}`}
              variant="outline"
              className="bg-muted/40"
            >
              {amenity[locale]}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {isArabic ? "الإيجار الشهري" : "Monthly rent"}
            </div>
            <div className="text-xl font-semibold">
              {formatCurrency(property.price, locale)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="font-medium text-foreground">{property.seller}</div>
            <div>{property.rating.toFixed(1)} ★</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-3 p-6 pt-0">
        <ButtonLink
          href={`/${locale}/properties/${property.id}`}
          variant="accent"
          className="flex-1"
        >
          {isArabic ? "عرض التفاصيل" : "View details"}
          <ArrowUpRight className="h-4 w-4" />
        </ButtonLink>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition hover:text-foreground"
          aria-label="Save favorite"
        >
          <Heart className="h-4 w-4" />
        </button>
      </CardFooter>
    </Card>
  );
}

function Meta({
  icon,
  label,
  caption,
}: {
  icon: ReactNode;
  label: string;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-lg font-semibold text-foreground">{label}</span>
      </div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {caption}
      </div>
    </div>
  );
}
