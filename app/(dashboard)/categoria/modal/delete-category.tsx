"use client";
import { deleteCategory } from "@/app/actions/categories/delete_categories";
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
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResponse } from "./form-schema";

interface DeleteCategoryProps {
  itemId: string;
  itemNome: string;
}

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteCategory({ itemId, itemNome }: DeleteCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(
    deleteCategory,
    initialState,
  );

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
      <DialogTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="link"
          size="sm"
          className="p-0 text-red-600"
          disabled={itemNome === "pagamentos"}
        >
          remover
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir Categoria</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="excluir" value={itemId} />
          <p>
            Tem certeza que deseja excluir <strong>{itemNome}</strong>?
          </p>
          <p className="text-destructive text-sm">
            Atenção: todos os lançamentos e orçamentos vinculados a esta categoria serão
            removidos permanentemente.
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
