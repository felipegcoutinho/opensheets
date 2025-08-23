"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserName, type ActionResponse } from "@/app/actions/users/update_profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  firstName: string | null;
  lastName: string | null;
};

const initialState: ActionResponse | null = null;

export default function AskNameModal({ firstName, lastName }: Props) {
  const needsName = useMemo(() => !firstName || !lastName, [firstName, lastName]);
  const [open, setOpen] = useState(needsName);
  const [state, formAction, pending] = useActionState(updateUserName, initialState);
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.refresh();
      setOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (!needsName) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        // Evita fechar enquanto for obrigatório preencher o nome
        if (!needsName) setOpen(v);
      }}
    >
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete seu nome</DialogTitle>
          <DialogDescription>
            Para personalizar sua experiência, informe seu nome e sobrenome.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-3">
          <div>
            <Label htmlFor="first_name">Nome</Label>
            <Input id="first_name" name="first_name" placeholder="Ex.: Felipe" required />
          </div>
          <div>
            <Label htmlFor="last_name">Sobrenome</Label>
            <Input id="last_name" name="last_name" placeholder="Ex.: Coutinho" required />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
