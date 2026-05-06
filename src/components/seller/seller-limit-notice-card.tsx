"use client";

import { useState } from "react";
import { BellRing, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export function SellerLimitNoticeCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <Card className="border-violet-500/20 bg-violet-500/5">
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <BellRing className="h-5 w-5 text-violet-500" />
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        </div>
        <X
          onClick={() => setVisible(false)}
          className="hover:scale-120 cursor-pointer"
        />
      </CardContent>
    </Card>
  );
}
