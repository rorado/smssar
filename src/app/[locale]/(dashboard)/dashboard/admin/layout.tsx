import type { ReactNode } from "react";
import {
  BarChart3,
  FileBadge2,
  ListChecks,
  Users,
  Settings2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const messages = getMessages(locale);

  const items = [
    {
      label: messages.dashboard.admin.overview,
      href: `/${locale}/dashboard/admin`,
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: messages.dashboard.admin.users,
      href: `/${locale}/dashboard/admin/users`,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: messages.dashboard.admin.listings,
      href: `/${locale}/dashboard/admin/listings`,
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      label: messages.dashboard.admin.plans,
      href: `/${locale}/dashboard/admin/plans`,
      icon: <Settings2 className="h-4 w-4" />,
    },
    {
      label: messages.dashboard.admin.reports,
      href: `/${locale}/dashboard/admin/reports`,
      icon: <FileBadge2 className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      locale={locale}
      title={messages.dashboard.admin.title}
      roleLabel={locale === "ar" ? "حساب المدير" : "Admin account"}
      items={items}
    >
      {children}
    </DashboardShell>
  );
}
