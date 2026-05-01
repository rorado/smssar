"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type RegisterSubmitButtonProps = {
  label: string;
  loadingLabel: string;
};

export function RegisterSubmitButton({
  label,
  loadingLabel,
}: RegisterSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="accent"
      className="w-full cursor-pointer hover:opacity-80 hover:scale-99"
      disabled={pending}
    >
      {pending ? loadingLabel : label}
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      )}
    </Button>
  );
}
