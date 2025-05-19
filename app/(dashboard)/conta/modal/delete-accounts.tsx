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
import { Trash2Icon } from "lucide-react";
import UtilitiesConta from "../utilities-conta";

export default function DeleteAccount({ itemId }) {
  const { handleDelete } = UtilitiesConta();

  return (
    <Dialog>
      <DialogTrigger>
        <Trash2Icon color="red" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja excluir ?</DialogTitle>
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
              Sim, quero excluir
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
