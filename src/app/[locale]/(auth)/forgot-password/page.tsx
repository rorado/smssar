import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
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

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <div className="mx-auto w-full max-w-lg">
      <Card className="glass border-border/70">
        <CardHeader>
          <CardTitle>{messages.auth.forgotTitle}</CardTitle>
          <CardDescription>{messages.auth.forgotDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{messages.auth.email}</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-11 rtl:pr-11 rtl:pl-4"
              />
            </div>
          </div>
          <ButtonLink
            href={`/${locale}/login`}
            variant="accent"
            className="w-full"
          >
            {messages.auth.resetLink}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </ButtonLink>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={`/${locale}/login`}
              className="font-medium text-violet-600 hover:underline dark:text-violet-300"
            >
              {messages.auth.haveAccount}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
