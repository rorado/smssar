import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson } from "@/lib/api-utils";

export const runtime = "nodejs";

type CreatePropertyBody = {
  title?: string;
  description?: string;
  city?: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  price?: number;
  categoryId?: string;
  featured?: boolean;
  imageUrl?: string | null;
};

export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      seller: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json({ data: properties });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonError("Authentication required.", 401);
  }

  if (session.user.role !== "SELLER") {
    return jsonError("Only sellers can create properties.", 403);
  }

  const body = await readJson<CreatePropertyBody>(request);
  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const title = body.title?.trim();
  const description = body.description?.trim();
  const city = body.city?.trim();
  const categoryId = body.categoryId?.trim();

  if (!title || !city || !categoryId) {
    return jsonError("Fields 'title', 'city', and 'categoryId' are required.");
  }

  if (
    typeof body.area !== "number" ||
    typeof body.rooms !== "number" ||
    typeof body.bathrooms !== "number" ||
    typeof body.price !== "number"
  ) {
    return jsonError(
      "Fields 'area', 'rooms', 'bathrooms', and 'price' must be numbers.",
    );
  }

  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        city,
        area: body.area,
        rooms: body.rooms,
        bathrooms: body.bathrooms,
        price: body.price,
        categoryId,
        sellerId: session.user.id,
        featured: body.featured ?? false,
        imageUrl: body.imageUrl ?? null,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ data: property }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return jsonError("Invalid 'categoryId' or 'sellerId'.", 400);
    }
    return jsonError("Failed to create property.", 500);
  }
}
