import { PropertyExplorer } from "@/components/property/property-explorer";
import { getMessages } from "@/lib/messages";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/locales";

const PAGE_SIZE = 10;

function toPositiveInteger(
  value: string | string[] | undefined,
  fallback: number,
) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const currentPage = toPositiveInteger(resolvedSearchParams.page, 1);
  const query = Array.isArray(resolvedSearchParams.query)
    ? resolvedSearchParams.query[0] || ""
    : resolvedSearchParams.query || "";
  const city = Array.isArray(resolvedSearchParams.city)
    ? resolvedSearchParams.city[0] || "all"
    : resolvedSearchParams.city || "all";
  const neighborhood = Array.isArray(resolvedSearchParams.neighborhood)
    ? resolvedSearchParams.neighborhood[0] || "all"
    : resolvedSearchParams.neighborhood || "all";
  const rooms = Array.isArray(resolvedSearchParams.rooms)
    ? resolvedSearchParams.rooms[0] || "all"
    : resolvedSearchParams.rooms || "all";
  const category = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0] || "all"
    : resolvedSearchParams.category || "all";
  const maxPrice = Array.isArray(resolvedSearchParams.maxPrice)
    ? resolvedSearchParams.maxPrice[0] || ""
    : resolvedSearchParams.maxPrice || "";

  const searchable = query.trim().toLowerCase();
  const numericRooms = rooms === "all" ? null : Number.parseInt(rooms, 10);
  const numericMaxPrice = maxPrice ? Number(maxPrice) : null;

  const matchingSellerIds = searchable
    ? await prisma.user.findMany({
        where: {
          name: { contains: searchable, mode: "insensitive" },
        },
        select: { id: true },
      })
    : [];

  const where = {
    ...(city !== "all" ? { city } : {}),
    ...(neighborhood !== "all" ? { neighborhood } : {}),
    ...(numericRooms ? { rooms: numericRooms } : {}),
    ...(category !== "all" ? { categoryId: category } : {}),
    ...(numericMaxPrice !== null ? { price: { lte: numericMaxPrice } } : {}),
    ...(searchable
      ? {
          OR: [
            { title: { contains: searchable, mode: "insensitive" as const } },
            {
              description: {
                contains: searchable,
                mode: "insensitive" as const,
              },
            },
            { city: { contains: searchable, mode: "insensitive" as const } },
            {
              neighborhood: {
                contains: searchable,
                mode: "insensitive" as const,
              },
            },
            ...(matchingSellerIds.length > 0
              ? [
                  {
                    sellerId: {
                      in: matchingSellerIds.map((seller) => seller.id),
                    },
                  },
                ]
              : []),
          ],
        }
      : {}),
  };

  // Fetch properties with seller information from database
  const [totalCount, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        neighborhood: true,
        area: true,
        rooms: true,
        bathrooms: true,
        price: true,
        categoryId: true,
        featured: true,
        imageUrl: true,
        sellerId: true,
        createdAt: true,
        media: {
          select: { id: true, url: true, type: true, publicId: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
  ]);

  const cities = await prisma.city.findMany({
    select: {
      name: true,
    },
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });

  // Fetch seller information for all properties
  const sellerIds = [...new Set(properties.map((p) => p.sellerId))];
  const sellers = await prisma.user.findMany({
    where: { id: { in: sellerIds } },
    select: { id: true, name: true },
  });

  const sellerMap = new Map(sellers.map((s) => [s.id, s.name]));

  const transformedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title,
    description: property.description || "",
    city: property.city,
    neighborhood: property.neighborhood || undefined,
    area: property.area || 0,
    rooms: property.rooms || 0,
    bathrooms: property.bathrooms || 0,
    price: property.price || 0,
    category: property.categoryId,
    featured: property.featured,
    imageUrl: property.imageUrl || undefined,
    seller: sellerMap.get(property.sellerId) || "Unknown",
    rating: 4.8, // Default rating
    inquiries: 0, // Default inquiries
    media: property.media.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      publicId: m.publicId,
    })),
  }));
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <PropertyExplorer
        locale={locale}
        properties={transformedProperties}
        cities={cities.map((item) => item.name)}
        categories={categories}
        title={messages.properties.title}
        subtitle={messages.properties.subtitle}
        noResults={messages.properties.noResults}
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(totalCount / PAGE_SIZE))}
      />
    </div>
  );
}
