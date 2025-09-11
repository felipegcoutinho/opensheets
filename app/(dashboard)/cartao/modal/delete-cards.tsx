"use client";

import DeleteButton from "@/components/delete-button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteCards } from "@/app/actions/cards/delete_cards";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteCard({ itemId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(deleteCards, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("excluir", itemId);
    await action(formData);
  };

  return (
    <DeleteButton
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleDelete={handleDelete}
      loading={isPending}
    />
  );
}
