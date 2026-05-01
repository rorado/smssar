import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { plans } from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={locale === "ar" ? "الخطط الاشتراكية" : "Seller plans"}
        title={messages.pricing.title}
        description={messages.pricing.subtitle}
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={
              plan.featured
                ? "border-violet-500/30 bg-violet-500/5 shadow-xl"
                : "border-border/70"
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{plan.title[locale]}</CardTitle>
                {plan.featured ? (
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {plan.description[locale]}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
