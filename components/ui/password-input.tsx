"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";

type PasswordInputProps = React.ComponentProps<"input"> & {
  containerClassName?: string;
};

export function PasswordInput({ className, containerClassName, ...props }: PasswordInputProps) {
  const [show, setShow] = React.useState(false);
  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        {...props}
        type={show ? "text" : "password"}
        className={cn("pr-9", className)}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
      </button>
    </div>
  );
}

