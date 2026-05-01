import Link from "next/link";
import { ArrowRight, BadgeCheck, Search, Shield, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { StatGrid } from "@/components/stat-grid";
import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  categories,
  properties,
  plans,
  stats,
  testimonials,
} from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";
import { formatCurrency } from "@/lib/format";

export default async function LandingPage({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const featuredProperties = properties
    .filter((property) => property.featured)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar locale={locale} messages={messages} />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_24%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <BadgeCheck className="h-4 w-4 text-violet-800" />
                {locale === "ar"
                  ? "منصة موثقة ومتعددة اللغات"
                  : "Verified, multilingual rental marketplace"}
              </div>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-6xl">
                  {messages.home.heroTitle}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  {messages.home.heroDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink
                  href={`/${locale}/properties`}
                  variant="accent"
                  size="lg"
                >
                  {messages.home.heroCta}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </ButtonLink>
                <ButtonLink
                  href={`/${locale}/register`}
                  variant="outline"
                  size="lg"
                >
                  {messages.home.heroSecondary}
                </ButtonLink>
              </div>
              <StatGrid
                locale={locale}
                items={stats.map((item) => ({
                  label: item.label[locale],
                  value: item.value,
                  icon: <Shield className="h-4 w-4" />,
                }))}
              />
            </div>

            <Card className="glass border-border/70 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                    <Search className="h-5 w-5" />
                  </span>
                  {messages.home.searchTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-muted/40 p-5">
                    <div className="text-sm text-muted-foreground">
                      {messages.common.city}
                    </div>
                    <div className="mt-2 text-xl font-semibold">Tetoan</div>
                  </div>
                  <div className="rounded-3xl bg-muted/40 p-5">
                    <div className="text-sm text-muted-foreground">
                      {messages.common.price}
                    </div>
                    <div className="mt-2 text-xl font-semibold">
                      {formatCurrency(15000, locale)}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-muted/40 p-5">
                    <div className="text-sm text-muted-foreground">
                      {messages.common.rooms}
                    </div>
                    <div className="mt-2 text-xl font-semibold">4</div>
                  </div>
                  <div className="rounded-3xl bg-muted/40 p-5">
                    <div className="text-sm text-muted-foreground">
                      {messages.common.verified}
                    </div>
                    <div className="mt-2 text-xl font-semibold">100%</div>
                  </div>
                </div>
                <ButtonLink
                  href={`/${locale}/properties`}
                  variant="default"
                  className="w-full"
                >
                  {messages.common.search}
                </ButtonLink>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="section-anchor mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={locale === "ar" ? "الأكثر طلباً" : "Top picks"}
            title={messages.home.featuredTitle}
            description={
              locale === "ar"
                ? "عقارات منتقاة بعناية من أفضل البائعين."
                : "Hand-picked homes from top sellers."
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                locale={locale}
                property={property}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={locale === "ar" ? "استكشف الفئات" : "Explore by category"}
            title={messages.home.categoriesTitle}
            description={
              locale === "ar"
                ? "ابدأ بالفئة التي تناسب احتياجك."
                : "Start with the category that fits your lifestyle."
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group border-border/70 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <CardHeader>
                  <CardTitle>{category.title[locale]}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {category.description[locale]}
                  </p>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <div className="text-3xl font-semibold">{category.count}</div>
                  <Link
                    href={`/${locale}/properties`}
                    className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300"
                  >
                    {locale === "ar" ? "تصفح" : "Browse"}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={locale === "ar" ? "الخطط" : "Plans"}
            title={messages.home.plansTitle}
            description={messages.pricing.subtitle}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{plan.title[locale]}</CardTitle>
                    {plan.featured ? (
                      <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
                        {messages.common.featured}
                      </div>
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
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        {feature[locale]}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={locale === "ar" ? "التجارب" : "Testimonials"}
            title={messages.home.testimonialsTitle}
            description={
              locale === "ar"
                ? "تجارب حقيقية من مستأجرين وبائعين."
                : "Real feedback from renters and sellers."
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="space-y-4 p-6">
                  <p className="text-sm leading-7 text-muted-foreground">
                    “{testimonial.quote[locale]}”
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role[locale]} ·{" "}
                      {testimonial.location[locale]}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-violet-500/20 bg-linear-to-r from-violet-500 to-fuchsia-600 text-white shadow-2xl shadow-violet-500/20">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-white/75">
                  {messages.home.contactTitle}
                </div>
                <h3 className="mt-4 text-3xl font-semibold md:text-4xl">
                  {locale === "ar"
                    ? "نحن جاهزون لمساعدتك في إطلاق أو إيجاد المنزل المناسب."
                    : "We are ready to help you launch, list, or find the right home."}
                </h3>
                <p className="mt-4 max-w-2xl text-white/85">
                  {messages.home.contactNote}
                </p>
              </div>
              <ButtonLink
                href={`/${locale}/login`}
                variant="outline"
                className="border-white/25 bg-white/10 text-white hover:bg-white/20"
              >
                {messages.home.contactButton}
              </ButtonLink>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter locale={locale} messages={messages} />
    </div>
  );
}
