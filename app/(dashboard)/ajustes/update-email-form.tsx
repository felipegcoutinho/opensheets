"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserEmail } from "@/app/actions/users/update_email";
import type { ActionResponse } from "@/app/actions/users/update_profile";

const initialState: ActionResponse = { success: false, message: "" };

export default function UpdateEmailForm({ defaultEmail = "" }: { defaultEmail?: string | null }) {
  const [state, action, isPending] = useActionState(updateUserEmail, initialState);

  useEffect(() => {
    if (!state?.message) return;
    state.success ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="max-w-sm space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Novo e-mail</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultEmail ?? ""} placeholder="seu@novoemail.com" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirm">Confirmar novo e-mail</Label>
        <Input id="confirm" name="confirm" type="email" placeholder="repita o e-mail" required />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Atualizar e-mail"}
      </Button>
    </form>
  );
}
