"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locales";

export function FavoriteButton({
  locale,
  propertyId,
  initialFavorite = false,
  enabled = true,
  className,
}: {
  locale: Locale;
  propertyId: string;
  initialFavorite?: boolean;
  enabled?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const toggleFavorite = () => {
    if (!enabled || isPending || status === "loading") {
      return;
    }

    if (!session?.user?.id) {
      router.push(`/${locale}/login`);
      return;
    }

    const nextValue = !isFavorite;
    setIsFavorite(nextValue);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}/favorite`, {
          method: "POST",
        });

        const payload = (await response.json().catch(() => null)) as {
          data?: { favorited?: boolean };
          error?: string;
        } | null;

        if (!response.ok) {
          throw new Error(payload?.error || `Status ${response.status}`);
        }

        setIsFavorite(Boolean(payload?.data?.favorited ?? nextValue));
        router.refresh();

        toast.success(
          nextValue
            ? locale === "ar"
              ? "تمت إضافة العقار إلى المفضلة."
              : locale === "fr"
                ? "Bien ajouté aux favoris."
                : "Property saved to favorites."
            : locale === "ar"
              ? "تمت إزالة العقار من المفضلة."
              : locale === "fr"
                ? "Bien retiré des favoris."
                : "Property removed from favorites.",
        );
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        setIsFavorite(!nextValue);
        toast.error(
          locale === "ar"
            ? "تعذر تحديث المفضلة."
            : locale === "fr"
              ? "Impossible de mettre à jour les favoris."
              : "Could not update favorites.",
        );
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleFavorite}
      disabled={!enabled || isPending || status === "loading"}
      className={cn(
        "gap-2 rounded-full",
        isFavorite
          ? "border-violet-500/40 bg-violet-500/10 text-violet-600 hover:bg-violet-500/15 dark:text-violet-300"
          : "",
        className,
      )}
      aria-label={
        isFavorite
          ? locale === "ar"
            ? "إزالة من المفضلة"
            : locale === "fr"
              ? "Retirer des favoris"
              : "Remove from favorites"
          : locale === "ar"
            ? "إضافة إلى المفضلة"
            : locale === "fr"
              ? "Ajouter aux favoris"
              : "Save to favorites"
      }
      aria-pressed={isFavorite}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Heart
          className={cn("h-4 w-4", isFavorite ? "fill-current" : "")}
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
