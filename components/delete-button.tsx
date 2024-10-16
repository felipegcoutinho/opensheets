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

export default function DeleteButton({
  handleDelete,
  isOpen,
  setIsOpen,
  itemResponsavel,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <span className={`${itemResponsavel === "Sistema" && "hidden"}`}>
          Remover
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja excluir ?</DialogTitle>
          <DialogDescription>
            <p>
              Isso não pode ser desfeito. Isso excluirá{" "}
              <strong>permanentemente</strong> seu lançamento e removerá seus
              dados de nossos servidores.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full gap-2">
          <DialogClose className="w-1/2" asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <form className="w-1/2" onSubmit={handleDelete}>
            <Button variant="destructive" className="w-full" type="submit">
              Sim, quero excluir
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
