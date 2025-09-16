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
import { RiCalculatorLine } from "@remixicon/react";
import * as React from "react";

export function CalculatorDialogButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-sm font-medium">
          <RiCalculatorLine className="h-4 w-4" />
          Calculadora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <RiCalculatorLine className="h-5 w-5" />
            Calculadora rápida
          </DialogTitle>
        </DialogHeader>
        <Calculator />
      </DialogContent>
    </Dialog>
  );
}
