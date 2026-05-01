import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { loginAction } from "./actions";
import { LoginSubmitButton } from "./login-submit-button";

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
          {errorText ? (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {errorText}
            </div>
          ) : null}
          <form
            action={async (formData) => {
              "use server";
              await loginAction(formData, locale);
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email">{messages.auth.email}</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 rtl:pr-11 rtl:pl-4"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{messages.auth.password}</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="pl-11 rtl:pr-11 rtl:pl-4"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                />
                {messages.auth.rememberMe}
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="font-medium text-violet-600 hover:underline dark:text-violet-300"
              >
                {messages.auth.forgotTitle}
              </Link>
            </div>
            <LoginSubmitButton
              label={messages.nav.login}
              loadingLabel={
                locale === "ar" ? "جاري تسجيل الدخول..." : "Signing in..."
              }
            />
          </form>
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
