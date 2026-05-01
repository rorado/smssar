import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-border/80 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10",
        className,
      )}
      {...props}
    />
  );
}
