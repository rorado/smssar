import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson } from "@/lib/api-utils";

export const runtime = "nodejs";

type UpdateMeBody = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  bio?: string;
  newPassword?: string;
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonError("Authentication required.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      city: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) {
    return jsonError("User not found.", 404);
  }

  return NextResponse.json({ data: user });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return jsonError("Authentication required.", 401);
  }

  const body = await readJson<UpdateMeBody>(request);
  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const data: {
    name?: string;
    email?: string;
    phone?: string | null;
    city?: string | null;
    bio?: string | null;
    passwordHash?: string;
  } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return jsonError("Name cannot be empty.", 400);
    }
    data.name = name;
  }

  if (typeof body.email === "string") {
    const email = body.email.trim().toLowerCase();
    if (!email) {
      return jsonError("Email cannot be empty.", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== session.user.id) {
      return jsonError("Email already exists.", 409);
    }

    data.email = email;
  }

  if (typeof body.phone === "string") {
    const phone = body.phone.trim();
    data.phone = phone.length > 0 ? phone : null;
  }

  if (typeof body.city === "string") {
    const city = body.city.trim();
    data.city = city.length > 0 ? city : null;
  }

  if (typeof body.bio === "string") {
    const bio = body.bio.trim();
    data.bio = bio.length > 0 ? bio : null;
  }

  if (typeof body.newPassword === "string") {
    const password = body.newPassword.trim();
    if (password.length > 0) {
      if (password.length < 8) {
        return jsonError("Password must be at least 8 characters.", 400);
      }
      data.passwordHash = await hash(password, 12);
    }
  }

  if (
    !data.name &&
    !data.email &&
    !data.phone &&
    !data.city &&
    !data.bio &&
    !data.passwordHash
  ) {
    return jsonError("No valid fields were provided.", 400);
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        city: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error: unknown) {
    console.error("Failed to update profile:", error);
    return jsonError("Failed to update profile.", 500);
  }
}
