import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson } from "@/lib/api-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdatePropertyBody = {
  title?: string;
  description?: string;
  city?: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  price?: number;
  categoryId?: string;
  sellerId?: string;
  featured?: boolean;
  imageUrl?: string | null;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      seller: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!property) {
    return jsonError("Property not found.", 404);
  }

  return NextResponse.json({ data: property });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await readJson<UpdatePropertyBody>(request);

  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const data: {
    title?: string;
    description?: string;
    city?: string;
    area?: number;
    rooms?: number;
    bathrooms?: number;
    price?: number;
    categoryId?: string;
    sellerId?: string;
    featured?: boolean;
    imageUrl?: string | null;
  } = {};

  if (typeof body.title === "string") {
    data.title = body.title.trim();
  }
  if (typeof body.description === "string") {
    data.description = body.description.trim();
  }
  if (typeof body.city === "string") {
    data.city = body.city.trim();
  }
  if (typeof body.area === "number") {
    data.area = body.area;
  }
  if (typeof body.rooms === "number") {
    data.rooms = body.rooms;
  }
  if (typeof body.bathrooms === "number") {
    data.bathrooms = body.bathrooms;
  }
  if (typeof body.price === "number") {
    data.price = body.price;
  }
  if (typeof body.categoryId === "string") {
    data.categoryId = body.categoryId.trim();
  }
  if (typeof body.sellerId === "string") {
    data.sellerId = body.sellerId.trim();
  }
  if (typeof body.featured === "boolean") {
    data.featured = body.featured;
  }
  if (typeof body.imageUrl === "string" || body.imageUrl === null) {
    data.imageUrl = body.imageUrl;
  }

  if (Object.keys(data).length === 0) {
    return jsonError("No valid fields provided for update.");
  }

  try {
    const property = await prisma.property.update({
      where: { id },
      data,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ data: property });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return jsonError("Property not found.", 404);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return jsonError(
        "Invalid relation reference for category or seller.",
        400,
      );
    }
    return jsonError("Failed to update property.", 500);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return jsonError("Property not found.", 404);
    }
    return jsonError("Failed to delete property.", 500);
  }
}
