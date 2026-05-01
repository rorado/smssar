import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson, toSlug } from "@/lib/api-utils";

export const runtime = "nodejs";

type CreateCategoryBody = {
  name?: string;
  slug?: string;
};

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { properties: true },
      },
    },
  });

  return NextResponse.json({ data: categories });
}

export async function POST(request: Request) {
  const body = await readJson<CreateCategoryBody>(request);
  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const name = body.name?.trim();
  if (!name) {
    return jsonError("Field 'name' is required.");
  }

  const slug = body.slug?.trim() || toSlug(name);
  if (!slug) {
    return jsonError("Field 'slug' is invalid.");
  }

  try {
    const category = await prisma.category.create({
      data: { name, slug },
    });
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError("Category slug already exists.", 409);
    }
    return jsonError("Failed to create category.", 500);
  }
}
