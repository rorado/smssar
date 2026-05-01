"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export async function loginAction(formData: FormData, locale: string) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect(`/${locale}/login?error=missing_fields`);
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${locale}/dashboard/seller`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/${locale}/login?error=invalid_credentials`);
    }
    throw error;
  }
}
