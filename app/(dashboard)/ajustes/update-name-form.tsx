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

  return (
    <form action={action} className="max-w-sm space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" name="name" defaultValue={defaultName} required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
