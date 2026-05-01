import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson, toSlug } from "@/lib/api-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateCategoryBody = {
  name?: string;
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

  const name = body.name?.trim();
  const nextSlug = body.slug?.trim();
  if (!name && !nextSlug) {
    return jsonError("At least one of 'name' or 'slug' is required.");
  }

  const data: { name?: string; slug?: string } = {};
  if (name) {
    data.name = name;
  }
  if (nextSlug) {
    data.slug = toSlug(nextSlug);
  } else if (name) {
    data.slug = toSlug(name);
  }

  try {
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
