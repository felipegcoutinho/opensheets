"use client";
import DeleteButton from "@/components/delete-button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteAccount } from "@/app/actions/accounts/delete_accounts";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteAccount({ itemId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(deleteAccount, initialState);

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
