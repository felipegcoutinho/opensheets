import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useTransition, type FormEvent } from "react";

interface BulkEditFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function BulkEditFooter({ isSubmitting, onCancel }: BulkEditFooterProps) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row">
      <DialogClose asChild>
        <Button
          className="w-full sm:w-1/2"
          type="button"
          variant="secondary"
        >
          Cancelar
        </Button>
      </DialogClose>
      <Button
        form="bulk-edit-form"
        className="w-full sm:w-1/2"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Aplicando..." : "Aplicar alterações"}
      </Button>
    </div>
  );
}