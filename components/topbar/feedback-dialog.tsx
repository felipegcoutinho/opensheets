"use client";

import FeedbackForm from "@/app/(dashboard)/ajustes/feedback-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiFeedbackLine } from "@remixicon/react";
import * as React from "react";

export function FeedbackDialogButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-sm font-medium">
          <RiFeedbackLine className="h-4 w-4" />
          Enviar feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <RiFeedbackLine className="h-5 w-5" />
            Compartilhe seu feedback
          </DialogTitle>
          <DialogDescription>
            Conte como podemos melhorar a sua experiência.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm onSubmitted={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
