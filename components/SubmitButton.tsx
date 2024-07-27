"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingText, ...props }) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <Button {...props} type="submit" aria-disabled={pending}>
      {isPending ? pendingText : children}
    </Button>
  );
}
