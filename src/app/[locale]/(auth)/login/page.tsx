import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { LoginFormClient } from "./login-form-client";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const messages = getMessages(locale);
  const errorText =
    error === "missing_fields"
      ? locale === "ar"
        ? "يرجى إدخال البريد الإلكتروني وكلمة المرور."
        : "Please enter both email and password."
      : error === "invalid_credentials"
        ? locale === "ar"
          ? "بيانات تسجيل الدخول غير صحيحة."
          : "Invalid email or password."
        : null;

  return (
    <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
          {locale === "ar" ? "تسجيل الدخول الآمن" : "Secure sign in"}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {messages.auth.loginTitle}
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          {messages.auth.loginDescription}
        </p>
      </div>

      <Card className="glass mx-auto w-full max-w-lg border-border/70">
        <CardHeader>
          <CardTitle>{messages.auth.loginTitle}</CardTitle>
          <CardDescription>{messages.auth.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <LoginFormClient
            locale={locale}
            messages={messages}
            initialErrorText={errorText}
          />
          <p className="text-center text-sm text-muted-foreground">
            {messages.auth.noAccount}{" "}
            <Link
              href={`/${locale}/register`}
              className="font-medium text-violet-600 hover:underline dark:text-violet-300"
            >
              {messages.nav.register}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
