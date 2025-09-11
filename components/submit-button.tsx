"use client";

import { Button } from "@/components/ui/button";
import { RiLoader2Line } from "@remixicon/react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingText: string;
  formAction: any;
};

export function SubmitButton({
  children,
  pendingText,
  ...props
}: SubmitButtonProps) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <Button
      {...props}
      type="submit"
      aria-disabled={pending}
      disabled={props.disabled || isPending || pending}
    >
      {isPending ? (
        <>
          <RiLoader2Line size={"20"} className="animate-spin" />
          <span className="ml-1">{pendingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
