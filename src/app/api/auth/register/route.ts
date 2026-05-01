import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, readJson } from "@/lib/api-utils";

export const runtime = "nodejs";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
};

export async function POST(request: Request) {
  const body = await readJson<RegisterBody>(request);

  if (!body) {
    return jsonError("Invalid JSON body.");
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const confirmPassword = body.confirmPassword;
  const roleValue = body.role?.trim().toLowerCase();

  if (!name || !email || !password || !confirmPassword || !roleValue) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "password_mismatch" }, { status: 400 });
  }

  const role = roleValue === "seller" ? "SELLER" : "USER";
  const passwordHash = await hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        role: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "email_exists" }, { status: 409 });
    }

    return jsonError("Failed to register account.", 500);
  }
}
