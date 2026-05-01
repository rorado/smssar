import { Check, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { getMessages } from "@/lib/messages";
import { plans } from "@/lib/site-data";
import type { Locale } from "@/lib/locales";

export default async function SellerPlanPage({
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
          {messages.dashboard.seller.plan}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "اختر الباقة المناسبة لعدد العقارات الذي تديره."
            : "Choose the right plan for your listing volume."}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={
              plan.featured
                ? "border-violet-500/30 bg-violet-500/5"
                : "border-border/70"
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {plan.featured ? (
                  <Crown className="h-4 w-4 text-violet-500" />
                ) : null}
                {plan.title[locale]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-semibold">
                {plan.price === 0
                  ? locale === "ar"
                    ? "مجاني"
                    : "Free"
                  : `$${plan.price}`}
              </div>
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div
                    key={`${plan.id}-feature-${index}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-violet-500" />
                    {feature[locale]}
                  </div>
                ))}
              </div>
              <ButtonLink
                href={`/${locale}/pricing`}
                variant={plan.featured ? "accent" : "outline"}
                className="w-full"
              >
                {locale === "ar" ? "عرض الباقات" : "View plans"}
              </ButtonLink>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
