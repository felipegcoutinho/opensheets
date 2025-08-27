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
    <Button
      {...props}
      type="submit"
      aria-disabled={pending}
      disabled={props.disabled || isPending || pending}
    >
      {isPending ? (
        <>
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="ml-1">{pendingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
