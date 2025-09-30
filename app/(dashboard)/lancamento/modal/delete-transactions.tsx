"use client";

import { deleteTransaction } from "@/app/actions/transactions/delete_transactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ActionResponse } from "./form-schema";

interface DeleteTransactionsProps {
  itemId: number | string;
  itemDescricao?: string | null;
}

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteTransactions({
  itemId,
  itemDescricao,
}: DeleteTransactionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(
    deleteTransaction,
    initialState,
  );

  const displayName = useMemo(() => {
    if (!itemDescricao) return "este lançamento";
    return itemDescricao;
  }, [itemDescricao]);

  useEffect(() => {
    if (isPending) return;
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state, isPending]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="cursor-pointer">remover</DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir Lançamento</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="excluir" value={String(itemId)} />

          <p>
            Tem certeza que deseja excluir <strong>{displayName}</strong>?
          </p>
          <p className="text-destructive text-sm">
            Atenção: este lançamento será removido permanentemente.
          </p>

          <DialogFooter className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
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
              className="w-full sm:w-1/2"
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

