"use client";
import DeleteButton from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, startTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/actions/categories/delete_categories";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteCategory({ itemNome, itemId }) {
  const [state, action, isPending] = useActionState(
    deleteCategory,
    initialState,
  );

  useEffect(() => {
    if (!state.message) return;
    state.success ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  const handleDelete = (id: number) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("excluir", id.toString());
      action(formData);
    });
  };

  return (
    <DeleteButton
      handleDelete={() => handleDelete(itemId)}
      loading={isPending}
      trigger={
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="link"
          size="sm"
          className="p-0 text-red-600"
          disabled={itemNome === "pagamentos"}
        >
          remover
        </Button>
      }
    />
  );
}
