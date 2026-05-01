import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/site-data";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locales";

export default async function AdminUsersPage({
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
          {messages.dashboard.admin.users}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "إدارة المستخدمين والبائعين والمديرين."
            : "Manage users, sellers, and admins."}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{messages.dashboard.admin.users}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm rtl:text-right">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border/70">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-4 font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Badge
                      variant={
                        user.status === "active" ? "accent" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
