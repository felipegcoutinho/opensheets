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
  loading,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={(e) => e.stopPropagation()}
        className="text-red-500"
      >
        Remover
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja excluir ?</DialogTitle>
          <DialogDescription>
            Isso não pode ser desfeito. Isso removerá
            <strong> permanentemente</strong> seu conteúdo e removerá seus dados
            de nossos servidores.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full gap-2">
          <DialogClose className="w-1/2" asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <form className="w-1/2" onSubmit={handleDelete}>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? "Removendo..." : " Sim, quero excluir"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
