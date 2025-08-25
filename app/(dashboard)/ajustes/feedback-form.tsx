"use client";

import {
  sendFeedback,
  type ActionState,
} from "@/app/actions/emails/send_feedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState: ActionState = { ok: false, message: "" };

export default function FeedbackForm() {
  const [state, action, pending] = useActionState(sendFeedback, initialState);

  useEffect(() => {
    if (!state.message) return;
    state.ok ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-2">
        <Label htmlFor="message">Seu feedback</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Descreva seu feedback aqui..."
          rows={6}
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar feedback"}
      </Button>
    </form>
  );
}
