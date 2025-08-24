"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingText: string;
  formAction: any;
};

export function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <Button {...props} type="submit" aria-disabled={pending}>
      {isPending ? pendingText : children}
    </Button>
  );
}
