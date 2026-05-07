import type { Locale } from "@/lib/locales";
import { FavoriteListingsPanel } from "@/components/shared/favorite-listings-panel";

export default async function SellerFavoritesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <FavoriteListingsPanel locale={locale} />;
}
