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
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => handleDelete(id)}
              variant="destructive"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Removendo..." : " Sim, quero excluir"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteButtonCategoria;
