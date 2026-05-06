import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) {
    return jsonError("User ID is required.", 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        bio: true,
        role: true,
        createdAt: true,
        planId: true,
      },
    });
    if (!user) {
      return jsonError("User not found.", 404);
    }

    return NextResponse.json({ data: user });
  } catch (error: unknown) {
    console.error("Failed to fetch user:", error);
    return jsonError("Failed to fetch user.", 500);
  }
}
