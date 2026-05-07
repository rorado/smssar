import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/locales";
import { UserProfilePanel } from "@/components/shared/user-profile-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/property";
import { getMessages } from "@/lib/messages";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const messages = getMessages(locale);

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  if (session.user.role !== "USER") {
    if (session.user.role === "SELLER") {
      redirect(`/${locale}/dashboard/seller`);
    }
    if (session.user.role === "ADMIN") {
      redirect(`/${locale}/dashboard/admin`);
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const favoriteRows = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        include: {
          category: {
            select: { name: true },
          },
          seller: {
            select: { name: true },
          },
          media: {
            select: { id: true, url: true, publicId: true, type: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  const favoriteProperties = favoriteRows.map((item) => ({
    id: item.property.id,
    title: item.property.title,
    description: item.property.description || "",
    imageUrl: item.property.imageUrl || undefined,
    city: item.property.city,
    neighborhood: item.property.neighborhood || undefined,
    area: item.property.area || 0,
    rooms: item.property.rooms || 0,
    bathrooms: item.property.bathrooms || 0,
    price: item.property.price || 0,
    category: item.property.category?.name || "",
    featured: item.property.featured,
    seller: item.property.seller?.name || "Unknown",
    rating: 4.8,
    inquiries: 0,
    media: item.property.media.map((media) => ({
      id: media.id,
      url: media.url,
      publicId: media.publicId,
      type: media.type,
    })),
    isFavorite: true,
    favoriteEnabled: true,
  }));

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-violet-600/15 via-background to-fuchsia-600/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full bg-fuchsia-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-violet-500/15 blur-2xl" />

        <div className="relative">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {locale === "ar" ? "الملف الشخصي" : "Profile"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {locale === "ar"
              ? "حدّث معلومات حسابك الشخصي هنا، وابقَ على تحكم كامل ببياناتك."
              : "Update your personal account information here and keep full control over your account details."}
          </p>
        </div>
      </div>

      <UserProfilePanel locale={locale} initialUser={user} />

      <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
        <CardHeader className="border-b border-border/60 pb-5">
          <CardTitle>{messages.dashboard.profile.favorites}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {messages.dashboard.profile.favoritesDescription}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {favoriteProperties.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {favoriteProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  locale={locale}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
              {messages.dashboard.profile.favoritesEmpty}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
