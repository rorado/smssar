"use client";

import { useMemo, useState } from "react";
import { ImagePlus, MapPinned, Save, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/locales";
import type { Property } from "@/lib/site-data";
import type { ReactNode } from "react";

export function ListingForm({
  locale,
  title,
  defaultListing,
}: {
  locale: Locale;
  title: string;
  defaultListing?: Property;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const initialValues = useMemo(
    () => ({
      title: defaultListing?.title[locale] ?? "",
      city: defaultListing?.city[locale] ?? "",
      price: defaultListing?.price?.toString() ?? "",
      rooms: defaultListing?.rooms?.toString() ?? "",
      area: defaultListing?.area?.toString() ?? "",
      description: defaultListing?.description[locale] ?? "",
    }),
    [defaultListing, locale],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setImages(Array.from(files).map((file) => file.name));
  };

  const handleVideoFiles = (files: FileList | null) => {
    if (!files) return;
    setVideos(Array.from(files).map((file) => file.name));
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <Field label={locale === "ar" ? "عنوان العقار" : "Listing title"}>
            <Input defaultValue={initialValues.title} />
          </Field>
          <Field label={locale === "ar" ? "المدينة" : "City"}>
            <Input defaultValue={initialValues.city} />
          </Field>
          <Field label={locale === "ar" ? "السعر الشهري" : "Monthly price"}>
            <Input defaultValue={initialValues.price} inputMode="numeric" />
          </Field>
          <Field label={locale === "ar" ? "عدد الغرف" : "Bedrooms"}>
            <Select defaultValue={initialValues.rooms || "2"}>
              {[1, 2, 3, 4, 5].map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={locale === "ar" ? "المساحة" : "Area"}>
            <Input defaultValue={initialValues.area} inputMode="numeric" />
          </Field>
          <Field label={locale === "ar" ? "الفئة" : "Category"}>
            <Select defaultValue="Apartments">
              <option value="family">
                {locale === "ar" ? "منازل عائلية" : "Family homes"}
              </option>
              <option value="apartments">
                {locale === "ar" ? "شقق" : "Apartments"}
              </option>
              <option value="villas">
                {locale === "ar" ? "فلل" : "Villas"}
              </option>
              <option value="luxury">
                {locale === "ar" ? "إقامات فاخرة" : "Luxury stays"}
              </option>
            </Select>
          </Field>
          <Field label={locale === "ar" ? "الوصف" : "Description"} full>
            <Textarea defaultValue={initialValues.description} />
          </Field>

          <div className="md:col-span-2">
            <Label className="mb-2 block">
              {locale === "ar" ? "صور العقار" : "Property images"}
            </Label>
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/80 bg-muted/20 px-6 text-center transition hover:bg-muted/40">
              <ImagePlus className="h-6 w-6 text-violet-500" />
              <span className="mt-3 text-sm font-medium">
                {locale === "ar"
                  ? "اسحب الصور أو انقر للرفع"
                  : "Drag images or click to upload"}
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(event) => handleFiles(event.target.files)}
              />
            </label>
            {images.length ? (
              <div className="mt-3 text-sm text-muted-foreground">
                {images.join(", ")}
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <Label className="mb-2 block">
              {locale === "ar" ? "فيديو العقار" : "Property video"}
            </Label>
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/80 bg-muted/20 px-6 text-center transition hover:bg-muted/40">
              <Video className="h-6 w-6 text-violet-500" />
              <span className="mt-3 text-sm font-medium">
                {locale === "ar"
                  ? "اسحب فيديو أو انقر للرفع"
                  : "Drag a video or click to upload"}
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="video/*"
                onChange={(event) => handleVideoFiles(event.target.files)}
              />
            </label>
            {videos.length ? (
              <div className="mt-3 text-sm text-muted-foreground">
                {videos.join(", ")}
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinned className="h-4 w-4" />
              {locale === "ar"
                ? "تجربة الرفع والعرض ستتصل بالباك-إند لاحقاً."
                : "Upload and save flows are ready for backend integration."}
            </div>
            <Button type="submit" variant="accent">
              <Save className="h-4 w-4" />
              {locale === "ar" ? "حفظ العقار" : "Save listing"}
            </Button>
          </div>

          {saved ? (
            <div className="md:col-span-2 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200">
              {locale === "ar"
                ? "تم حفظ المسودة بنجاح."
                : "Draft saved successfully."}
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
