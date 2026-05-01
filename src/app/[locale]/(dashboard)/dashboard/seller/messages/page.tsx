import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMessages } from "@/lib/messages";
import { inboxMessages } from "@/lib/site-data";
import type { Locale } from "@/lib/locales";

export default async function SellerMessagesPage({
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
          {messages.dashboard.seller.messages}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "راجع الرسائل الجديدة ورد بسرعة."
            : "Review new inquiries and respond quickly."}
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {inboxMessages.map((message) => (
          <Card key={message.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{message.name}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {message.listing}
                </p>
              </div>
              {message.unread ? (
                <Badge variant="accent">New</Badge>
              ) : (
                <Badge variant="secondary">Read</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{message.preview[locale]}</p>
              <div>{message.time}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
