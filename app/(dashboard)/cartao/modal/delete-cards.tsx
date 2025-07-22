"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState, useEffect, useState } from "react";
import { deleteCards } from "@/app/actions/cards/delete_cards";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteCard({ itemId }) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState(deleteCards, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-0" asChild>
        <Button variant="link">remover</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Boleto?</DialogTitle>
          <DialogDescription>
            Isso não pode ser desfeito. Isso excluirá
            <strong>permanentemente</strong> seu lançamento e removerá seus
            dados de nossos servidores.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button className="w-full" type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <form action={action} className="w-full">
            <input type="hidden" name="excluir" value={itemId} />
            <Button variant="destructive" className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Removendo..." : "Sim, quero remover"}
            </Button>
          </form>
        </DialogFooter>

        {state.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            {state.success && <CheckCircle2 className="h-4 w-4" />}
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
