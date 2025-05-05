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

function DeleteButtonCategoria({ handleDelete, id, isPending, descricao }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="link"
          size="sm"
          className="p-0 text-red-600"
          disabled={descricao === "pagamentos"}
        >
          excluir
        </Button>
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
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(id)}
            className="cursor-pointer"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Removendo..." : " Sim, quero excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteButtonCategoria;
