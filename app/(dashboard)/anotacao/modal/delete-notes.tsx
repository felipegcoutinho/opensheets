"use client";
import DeleteButton from "@/components/delete-button";
import { startTransition, useActionState, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { deleteNote } from "@/app/actions/notes/delete_notes";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteNotes({ item, trigger }: { item: any; trigger?: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(deleteNote, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const handleDelete = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("excluir", item.id.toString());
      action(formData);
    });
  };

  return (
    <DeleteButton
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleDelete={handleDelete}
      loading={isPending}
      trigger={trigger}
    />
  );
}
