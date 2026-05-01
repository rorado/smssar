import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminReportsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.admin.reports}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "لوحة سريعة لقياس الأداء والمخاطر والنمو."
            : "Quick view into performance, risks, and growth."}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "الزيارات" : "Visits"}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">84.2K</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "التحويل" : "Conversion"}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">4.8%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{locale === "ar" ? "الإبلاغات" : "Flags"}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">7</CardContent>
        </Card>
      </div>
    </div>
  );
}
