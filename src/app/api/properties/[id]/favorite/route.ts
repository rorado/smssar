import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-utils";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonError("Authentication required.", 401);
  }

  const { id } = await context.params;

  const property = await prisma.property.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!property) {
    return jsonError("Property not found.", 404);
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: session.user.id,
        propertyId: id,
      },
    },
    select: { id: true },
  });

  if (favorite) {
    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: id,
        },
      },
    });

    return NextResponse.json({ data: { favorited: false } });
  }

  await prisma.favorite.create({
    data: {
      userId: session.user.id,
      propertyId: id,
    },
  });

  return NextResponse.json({ data: { favorited: true } });
}
