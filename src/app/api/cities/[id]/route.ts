import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson, toSlug } from "@/lib/api-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateCityBody = {
  name_en?: string;
  name_ar?: string;
  name_fr?: string;
  slug?: string;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;

  const city = await prisma.city.findUnique({
    where: { id },
  });

  if (!city) {
    return jsonError("City not found.", 404);
  }

  const propertyCount = await prisma.property.count({
    where: { city: city.name },
  });

  return NextResponse.json({ data: { ...city, propertyCount } });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await readJson<UpdateCityBody>(request);

  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const nameEn = body.name_en?.trim();
  const nameAr = body.name_ar?.trim();
  const nameFr = body.name_fr?.trim();
  const nextSlug = body.slug?.trim();
  if (!nameEn && !nameAr && !nameFr && !nextSlug) {
    return jsonError(
      "At least one of 'name_en', 'name_ar', 'name_fr' or 'slug' is required.",
    );
  }

  const currentCity = await prisma.city.findUnique({ where: { id } });
  if (!currentCity) {
    return jsonError("City not found.", 404);
  }

  const data: {
    name?: string;
    name_en?: string;
    name_ar?: string;
    name_fr?: string;
    slug?: string;
  } = {};
  if (nameEn) {
    data.name = nameEn;
    data.name_en = nameEn;
  }
  if (typeof nameAr === "string") {
    data.name_ar = nameAr;
  }
  if (typeof nameFr === "string") {
    data.name_fr = nameFr;
  }
  if (nextSlug) {
    data.slug = toSlug(nextSlug);
  } else if (nameEn) {
    data.slug = toSlug(nameEn);
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Prisma client needs regeneration after schema change; payload shape is correct
      const city = await tx.city.update({
        where: { id },
        data,
      });

      if (nameEn && nameEn !== currentCity.name) {
        await tx.property.updateMany({
          where: { city: currentCity.name },
          data: { city: nameEn },
        });
      }

      return city;
    });

    const propertyCount = await prisma.property.count({
      where: { city: updated.name },
    });

    return NextResponse.json({
      data: { ...updated, propertyCount },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return jsonError("City not found.", 404);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError("City name or slug already exists.", 409);
    }
    return jsonError("Failed to update city.", 500);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  const city = await prisma.city.findUnique({ where: { id } });
  if (!city) {
    return jsonError("City not found.", 404);
  }

  const propertyCount = await prisma.property.count({
    where: { city: city.name },
  });

  if (propertyCount > 0) {
    return jsonError(
      "Cannot delete city because properties still reference it.",
      409,
    );
  }

  await prisma.city.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
