import Link from "next/link";
import { Mail, Lock, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { registerAction } from "./actions";
import { RegisterSubmitButton } from "./register-submit-button";

export default async function RegisterPage({
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
        ? "يرجى تعبئة جميع الحقول المطلوبة."
        : "Please complete all required fields."
      : error === "weak_password"
        ? locale === "ar"
          ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل."
          : "Password must be at least 8 characters long."
        : error === "password_mismatch"
          ? locale === "ar"
            ? "كلمتا المرور غير متطابقتين."
            : "Password and confirmation do not match."
          : error === "email_exists"
            ? locale === "ar"
              ? "هذا البريد الإلكتروني مستخدم بالفعل."
              : "This email is already registered."
            : error === "server_error"
              ? locale === "ar"
                ? "حدث خطأ غير متوقع. حاول مرة أخرى."
                : "Something went wrong. Please try again."
              : null;

  return (
    <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
          {locale === "ar"
            ? "ابدأ خلال دقيقة"
            : "Get started in under a minute"}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {messages.auth.registerTitle}
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          {messages.auth.registerDescription}
        </p>
      </div>

      <Card className="glass mx-auto w-full max-w-lg border-border/70">
        <CardHeader>
          <CardTitle>{messages.auth.registerTitle}</CardTitle>
          <CardDescription>{messages.auth.registerDescription}</CardDescription>
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
              await registerAction(formData, locale);
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="name">{messages.auth.fullName}</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
                <Input
                  id="name"
                  name="name"
                  placeholder={locale === "ar" ? "محمد أحمد" : "John Doe"}
                  className="pl-11 rtl:pr-11 rtl:pl-4"
                  required
                />
              </div>
            </div>
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
              <Label htmlFor="role">{messages.auth.accountType}</Label>
              <Select id="role" name="role" defaultValue="user">
                <option value="user">
                  {locale === "ar" ? "مستأجر" : "Renter"}
                </option>
                <option value="seller">
                  {locale === "ar" ? "بائع" : "Seller"}
                </option>
              </Select>
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
                  minLength={8}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">{messages.auth.confirmPassword}</Label>
              <Input
                id="confirm"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <RegisterSubmitButton
              label={messages.nav.register}
              loadingLabel={
                locale === "ar" ? "جاري إنشاء الحساب..." : "Creating account..."
              }
            />
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {messages.auth.haveAccount}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-medium text-violet-600 hover:underline dark:text-violet-300"
            >
              {messages.nav.login}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
