import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson, toSlug } from "@/lib/api-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateCategoryBody = {
  name_en?: string;
  name_ar?: string;
  name_fr?: string;
  slug?: string;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { properties: true },
      },
    },
  });

  if (!category) {
    return jsonError("Category not found.", 404);
  }

  return NextResponse.json({ data: category });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await readJson<UpdateCategoryBody>(request);

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Prisma client needs regeneration after schema change; payload shape is correct
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return NextResponse.json({ data: category });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return jsonError("Category not found.", 404);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return jsonError("Category slug already exists.", 409);
    }
    return jsonError("Failed to update category.", 500);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return jsonError("Category not found.", 404);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return jsonError(
        "Cannot delete category because properties still reference it.",
        409,
      );
    }
    return jsonError("Failed to delete category.", 500);
  }
}
