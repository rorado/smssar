import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson, toSlug } from "@/lib/api-utils";

export const runtime = "nodejs";

type CreateCategoryBody = {
  name_en?: string;
  name_ar?: string;
  name_fr?: string;
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
  const session = await auth();

  if (!session?.user?.id) {
    return jsonError("Authentication required.", 401);
  }

  if (session.user.role !== "ADMIN") {
    return jsonError("Only admins can create categories.", 403);
  }

  const body = await readJson<CreateCategoryBody>(request);
  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const nameEn = body.name_en?.trim();
  const nameAr = body.name_ar?.trim() || "";
  const nameFr = body.name_fr?.trim() || "";

  if (!nameEn) {
    return jsonError("Field 'name_en' is required.");
  }

  const slug = body.slug?.trim() || toSlug(nameEn);
  if (!slug) {
    return jsonError("Field 'slug' is invalid.");
  }

  try {
    const payload = JSON.parse(
      JSON.stringify({
        name: nameEn,
        name_en: nameEn,
        name_ar: nameAr,
        name_fr: nameFr,
        slug,
      }),
    );

    const category = await prisma.category.create({ data: payload });
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
