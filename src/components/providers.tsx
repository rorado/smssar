"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { LocaleSync } from "./locale-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LocaleSync />
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className:
            "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xl",
        }}
      />
    </SessionProvider>
  );
}
