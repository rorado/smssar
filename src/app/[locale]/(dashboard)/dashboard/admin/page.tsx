import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatGrid } from "@/components/stat-grid";
import { adminStats, users, properties } from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {messages.dashboard.admin.overview}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "لوحة تحكم شاملة لإدارة المستخدمين والعقارات والخطط."
            : "Unified control center for users, listings, plans, and reports."}
        </p>
      </div>
      <StatGrid
        locale={locale}
        items={adminStats.map((item) => ({
          label: item.label[locale],
          value: item.value,
        }))}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{messages.dashboard.admin.users}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
                <div className="text-muted-foreground">{user.role}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{messages.dashboard.admin.listings}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {properties.slice(0, 4).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-medium">{property.title[locale]}</div>
                  <div className="text-muted-foreground">
                    {property.city[locale]}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {property.inquiries}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
