"use client";

import { Button } from "@/components/ui/button";
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

export default function DeleteButton({ handleDelete, isOpen, setIsOpen, loading }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        onClick={(e) => e.stopPropagation()}
        className="cursor-pointer text-red-500"
      >
        Remover
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir ?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso não pode ser desfeito. Isso removerá
            <strong> permanentemente</strong> seu conteúdo e removerá seus dados
            de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full gap-2">
          <AlertDialogCancel asChild className="w-1/2">
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </AlertDialogCancel>
          <form className="w-1/2" onSubmit={handleDelete}>
            <AlertDialogAction asChild>
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
