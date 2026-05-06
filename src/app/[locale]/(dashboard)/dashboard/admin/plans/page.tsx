import { AdminPlansPanel } from "@/components/admin/admin-plans-panel";
import { prisma } from "@/lib/prisma";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminPlansPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const plans = await prisma.plan.findMany({
    orderBy: { price: "asc" },
  });

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
      <AdminPlansPanel locale={locale} initialPlans={plans} />
    </div>
  );
}
