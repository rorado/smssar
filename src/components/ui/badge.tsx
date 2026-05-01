import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "secondary" | "outline" | "accent";

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-muted text-foreground",
  outline: "border border-border bg-transparent text-foreground",
  accent:
    "bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-300",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
