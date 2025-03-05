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
import Utils from "../utils";

export default function DeleteInvest({ itemId }) {
  const { handleDelete, isOpen, setIsOpen } = Utils();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="p-0" asChild>
        <Button variant="link">Remover</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Investimentoo?</DialogTitle>
          <DialogDescription>
            Isso não pode ser desfeito. Isso excluirá{" "}
            <strong>permanentemente</strong> seu lançamento.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button className="w-full" type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <form onSubmit={handleDelete(itemId)}>
            <Button variant="destructive" className="w-full" type="submit">
              Sim, quero remover
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
