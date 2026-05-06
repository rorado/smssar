import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function UserProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  if (session.user.role === "SELLER") {
    redirect(`/${locale}/dashboard/seller`);
  }

  if (session.user.role === "ADMIN") {
    redirect(`/${locale}/dashboard/admin`);
  }

  const messages = getMessages(locale);
  const items = [
    {
      label: messages.nav.profile,
      href: `/${locale}/dashboard/profile`,
      icon: <UserRound className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      locale={locale}
      title={locale === "ar" ? "لوحة المستخدم" : "User dashboard"}
      roleLabel={locale === "ar" ? "حساب المستخدم" : "User account"}
      items={items}
    >
      {children}
    </DashboardShell>
  );
}
