"use client";

import { deleteUser } from "@/app/actions/users/delete-user";
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
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { useState } from "react";

export default function DeleteUserForm() {
  const [confirmText, setConfirmText] = useState("");
  const ok = confirmText.trim().toUpperCase() === "DELETAR";
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deletar conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá deletar permanentemente sua conta e remover seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <p className="text-sm">
            Para confirmar, digite <span className="font-semibold">DELETAR</span> no campo abaixo.
          </p>
          <Input
            placeholder="DELETAR"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteUser}>
            <SubmitButton disabled={!ok} />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction asChild>
      <Button type="submit" disabled={pending || disabled} variant="destructive">
        {pending ? "Deletando..." : "Deletar"}
      </Button>
    </AlertDialogAction>
  );
}
