"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  updateUserName,
  type ActionResponse,
} from "@/app/actions/users/update_profile";

const initialState: ActionResponse = { success: false, message: "" };

export default function UpdateNameForm({
  defaultName,
}: {
  defaultName: string;
}) {
  const [state, action, isPending] = useActionState(
    updateUserName,
    initialState,
  );

  useEffect(() => {
    if (!state.message) return;
    state.success ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  // Pré-preenche separando o primeiro nome do restante
  const [first, ...rest] = (defaultName ?? "").trim().split(/\s+/).filter(Boolean);
  const defaultFirst = first ?? "";
  const defaultLast = rest.join(" ");

  return (
    <form action={action} className="max-w-sm space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="first_name">Primeiro nome</Label>
        <Input
          id="first_name"
          name="first_name"
          defaultValue={defaultFirst}
          placeholder="Ex.: Felipe"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="last_name">Sobrenome</Label>
        <Input
          id="last_name"
          name="last_name"
          defaultValue={defaultLast}
          placeholder="Ex.: Coutinho"
          required
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
