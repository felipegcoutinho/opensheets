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

export default function DeleteCard({ itemId }) {
  const { handleDelete } = Utils();

  return (
    <Dialog>
      <DialogTrigger className="p-0" asChild>
        <Button variant="link">remover</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Boleto?</DialogTitle>
          <DialogDescription>
            <p>
              Isso não pode ser desfeito. Isso excluirá <strong>permanentemente</strong> seu lançamento e removerá seus dados de nossos servidores.
            </p>
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

    // <AlertDialog>
    //   <AlertDialogTrigger>
    //     <Trash2Icon color="red" />
    //   </AlertDialogTrigger>
    //   <AlertDialogContent>
    //     <AlertDialogHeader>
    //       <AlertDialogTitle>Remover Boleto?</AlertDialogTitle>
    //       <AlertDialogDescription>
    //         Isso não pode ser desfeito. Isso excluirá <strong>permanentemente</strong> seu boleto e removerá seus dados de nossos servidores.
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <AlertDialogCancel>Cancel</AlertDialogCancel>
    //       <form onSubmit={handleDelete(itemId)}>
    //         <Button variant="destructive" className="w-full" type="submit">
    //           Sim, quero remover
    //         </Button>
    //       </form>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>
  );
}
