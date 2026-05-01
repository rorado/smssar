import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminPlansPage({
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
          {messages.dashboard.admin.plans}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "غيّر باقات البائعين وعدّل حدود العقارات."
            : "Change seller tiers and adjust listing limits."}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.title[locale]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>{plan.description[locale]}</div>
              <div>
                {locale === "ar" ? "الحد" : "Limit"}:{" "}
                {plan.listings === "unlimited"
                  ? locale === "ar"
                    ? "غير محدود"
                    : "Unlimited"
                  : plan.listings}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
