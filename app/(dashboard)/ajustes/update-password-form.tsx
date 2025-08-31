"use client";

import { useActionState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { updateUserPassword } from "@/app/actions/users/update_password";
import type { ActionResponse } from "@/app/actions/users/update_profile";

const initialState: ActionResponse = { success: false, message: "" };

export default function UpdatePasswordForm({ defaultEmail = "" }: { defaultEmail?: string | null }) {
  const [stateUpdate, actionUpdate, pendingUpdate] = useActionState(updateUserPassword, initialState);

  useEffect(() => {
    if (!stateUpdate?.message) return;
    stateUpdate.success ? toast.success(stateUpdate.message) : toast.error(stateUpdate.message);
  }, [stateUpdate]);

  return (
    <div className="max-w-sm space-y-6">
      <form action={actionUpdate} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="password">Nova senha</Label>
          <PasswordInput id="password" name="password" placeholder="Mínimo de 6 caracteres" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm">Confirmar nova senha</Label>
          <PasswordInput id="confirm" name="confirm" placeholder="Repita a senha" required />
        </div>

        <Button type="submit" disabled={pendingUpdate}>
          {pendingUpdate ? "Salvando..." : "Atualizar senha"}
        </Button>
      </form>
    </div>
  );
}
