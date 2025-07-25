"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  sendPasswordReset,
  type ActionResponse,
} from "@/app/actions/users/update_profile";

const initialState: ActionResponse = { success: false, message: "" };

export default function ResetPasswordForm({ email }: { email: string }) {
  const [state, action, isPending] = useActionState(
    sendPasswordReset,
    initialState,
  );

  useEffect(() => {
    if (!state.message) return;
    state.success ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="max-w-sm space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Enviando..." : "Enviar link"}
      </Button>
    </form>
  );
}
