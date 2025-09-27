"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

type Props = {
  handleDelete: (e?: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  loading?: boolean;
  trigger?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
};

export default function DeleteButton({
  handleDelete,
  loading = false,
  trigger,
  isOpen,
  setIsOpen,
}: Props) {
  const [open, setOpen] = useState(false);
  const dialogOpen = isOpen ?? open;
  const handleOpenChange = setIsOpen ?? setOpen;

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : (
        <AlertDialogTrigger
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer text-red-500"
        >
          remover
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover definitivamente?</AlertDialogTitle>
          <AlertDialogDescription>
            Atenção: ao remover, todos os dados relacionados a este item (conta,
            cartão ou pagador) serão <strong>permanentemente</strong> excluídos
            dos nossos servidores. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full gap-2">
          <AlertDialogCancel asChild className="w-1/2">
            <Button type="button" variant={"outline"}>
              Cancelar
            </Button>
          </AlertDialogCancel>
          <form
            className="w-1/2"
            onSubmit={(e) => {
              e.preventDefault();
              handleDelete(e);
            }}
          >
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-xs"
              asChild
            >
              <Button
                variant="destructive"
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Removendo..." : " Sim, quero excluir"}
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
