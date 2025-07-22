"use client";
import DeleteButtonCategoria from "@/components/delete-button-categoria";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteBudget } from "@/app/actions/orcamentos/delete_budget";
import type { ActionResponse } from "./form-schema";

type Props = { itemId: number };

const initialState: ActionResponse = { success: false, message: "" };

export default function DeleteBudget({ itemId }: Props) {
  const [state, action, isPending] = useActionState(deleteBudget, initialState);

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
      descricao="orçamento"
      handleDelete={handleDelete}
      isPending={isPending}
    />
  );
}
