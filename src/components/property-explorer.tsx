"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PropertyCard } from "@/components/property-card";
import type { Locale } from "@/lib/locales";
import type { Property } from "@/lib/site-data";

export function PropertyExplorer({
  locale,
  properties,
  title,
  subtitle,
  noResults,
}: {
  locale: Locale;
  properties: Property[];
  title: string;
  subtitle: string;
  noResults: string;
}) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [rooms, setRooms] = useState("all");
  const [maxPrice, setMaxPrice] = useState("25000");

  const cities = useMemo(
    () => [
      "all",
      ...new Set(properties.map((property) => property.city[locale])),
    ],
    [locale, properties],
  );

  const filtered = useMemo(() => {
    const searchable = query.trim().toLowerCase();
    return properties.filter((property) => {
      const matchesQuery =
        !searchable ||
        [
          property.title[locale],
          property.description[locale],
          property.city[locale],
          property.seller,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchable);
      const matchesCity = city === "all" || property.city[locale] === city;
      const matchesRooms =
        rooms === "all" || property.rooms.toString() === rooms;
      const matchesPrice = property.price <= Number(maxPrice || 0);
      return matchesQuery && matchesCity && matchesRooms && matchesPrice;
    });
  }, [city, locale, maxPrice, properties, query, rooms]);

  const reset = () => {
    setQuery("");
    setCity("all");
    setRooms("all");
    setMaxPrice("25000");
  };

  return (
    <div className="space-y-8">
      <Card className="border-border/70 bg-card/95 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              {locale === "ar" ? "ابحث" : "Search"}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مدينة أو عقار أو بائع"
                    : "City, home, or seller"
                }
                className="pl-11 rtl:pr-11 rtl:pl-4"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              {locale === "ar" ? "المدينة" : "City"}
            </label>
            <Select
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? (locale === "ar" ? "الكل" : "All") : item}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              {locale === "ar" ? "عدد الغرف" : "Rooms"}
            </label>
            <Select
              value={rooms}
              onChange={(event) => setRooms(event.target.value)}
            >
              <option value="all">{locale === "ar" ? "الكل" : "All"}</option>
              {[1, 2, 3, 4, 5].map((room) => (
                <option key={room} value={room}>
                  {room}+
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              {locale === "ar" ? "أعلى سعر" : "Max price"}
            </label>
            <Input
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              inputMode="numeric"
            />
          </div>
        </CardContent>
        <div className="flex flex-wrap items-center gap-3 px-6 pb-6">
          <Button type="button" variant="accent" onClick={reset}>
            {locale === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {filtered.length} {locale === "ar" ? "نتيجة" : "results"}
          </span>
        </div>
      </Card>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              locale={locale}
              property={property}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex min-h-64 items-center justify-center text-center text-muted-foreground">
            {noResults}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
