import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson, toSlug } from "@/lib/api-utils";

export const runtime = "nodejs";

type CreateCityBody = {
  name_en?: string;
  name_ar?: string;
  name_fr?: string;
  slug?: string;
};

export async function GET() {
  const [cities, counts] = await Promise.all([
    prisma.city.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.property.groupBy({
      by: ["city"],
      _count: { city: true },
    }),
  ]);

  const countMap = new Map(counts.map((item) => [item.city, item._count.city]));

  return NextResponse.json({
    data: cities.map((city) => ({
      ...city,
      propertyCount: countMap.get(city.name) ?? 0,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonError("Authentication required.", 401);
  }

  if (session.user.role !== "ADMIN") {
    return jsonError("Only admins can create cities.", 403);
  }

  const body = await readJson<CreateCityBody>(request);
  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const nameEn = body.name_en?.trim();
  const nameAr = body.name_ar?.trim() || null;
  const nameFr = body.name_fr?.trim() || null;

  if (!nameEn) {
    return jsonError("Field 'name_en' is required.");
  }

  const slug = body.slug?.trim() || toSlug(nameEn);
  if (!slug) {
    return jsonError("Field 'slug' is invalid.");
  }

  try {
    const createData = {
      name: nameEn,
      name_en: nameEn,
      name_ar: nameAr,
      name_fr: nameFr,
      slug,
    } as unknown as Parameters<typeof prisma.city.create>[0]["data"];

    const city = await prisma.city.create({
      data: createData,
    });

    return NextResponse.json(
      { data: { ...city, propertyCount: 0 } },
      { status: 201 },
    );
  } catch (error: unknown) {
    const prismaCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? ((error as { code: string }).code as string)
        : null;

    if (prismaCode === "P2002") {
      return jsonError("City name or slug already exists.", 409);
    }

    console.error("City create failed", error);

    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      return jsonError(`Failed to create city: ${error.message}`, 500);
    }

    return jsonError("Failed to create city.", 500);
  }
}
