import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/auth";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import type { ReactNode } from "react";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const session = await auth();
  
  const profileName =
    session?.user?.name?.trim() || (locale === "ar" ? "مستخدم" : "User");
  const profileEmail =
    session?.user?.email?.trim() ||
    (locale === "ar" ? "لا يوجد بريد إلكتروني" : "No email available");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.seller.profile}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "حدِّث بيانات البائع والمعلومات العامة."
            : "Update seller profile and public contact details."}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{messages.dashboard.seller.profile}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <Field label={messages.auth.fullName}>
            <Input defaultValue={profileName} />
          </Field>
          <Field label={messages.auth.email}>
            <Input defaultValue={profileEmail} />
          </Field>
          <Field label={locale === "ar" ? "رقم الهاتف" : "Phone"}>
            <Input defaultValue="+971 50 000 0000" />
          </Field>
          <Field label={locale === "ar" ? "نبذة" : "Bio"} full>
            <Textarea
              defaultValue={
                locale === "ar"
                  ? "بائع موثق للعقارات السكنية المميزة."
                  : "Verified seller specializing in premium rental homes."
              }
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
