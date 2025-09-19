"use client";

import Calculator from "@/components/calculator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RiCalculatorLine } from "@remixicon/react";
import * as React from "react";

type Variant = React.ComponentProps<typeof Button>["variant"];
type Size = React.ComponentProps<typeof Button>["size"];

type CalculatorDialogButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
};

export function CalculatorDialogButton({
  variant = "ghost",
  size = "sm",
  className,
  children,
}: CalculatorDialogButtonProps) {
  const [open, setOpen] = React.useState(false);
  const label =
    children ?? (
      <span className="inline-flex items-center gap-2">
        <RiCalculatorLine className="h-4 w-4" />
        Calculadora
      </span>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("text-sm font-medium", className)}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <RiCalculatorLine className="h-5 w-5" />
            Calculadora
          </DialogTitle>
        </DialogHeader>
        <Calculator />
      </DialogContent>
    </Dialog>
  );
}
