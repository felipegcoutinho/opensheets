"use client";
import DeleteButtonCategoria from "@/components/delete-button-categoria";
import { useActionState, useEffect } from "react";
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

  const handleDelete = async (id: number) => {
    const formData = new FormData();
    formData.append("excluir", id.toString());
    await action(formData);
  };

  return (
    <DeleteButtonCategoria
      id={itemId}
      descricao={itemNome}
      handleDelete={handleDelete}
      isPending={isPending}
    />
  );
}
