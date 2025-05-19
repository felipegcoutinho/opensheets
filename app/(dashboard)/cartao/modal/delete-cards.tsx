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
import UtilitiesCartao from "../utilities-cartao";

export default function DeleteCard({ itemId }) {
  const { handleDelete } = UtilitiesCartao();

  return (
    <Dialog>
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
