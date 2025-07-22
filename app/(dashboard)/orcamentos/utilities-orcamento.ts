import { createBudget } from "@/app/actions/orcamentos/create_budget";
import { editBudget } from "@/app/actions/orcamentos/update_budget";
import { removeBudget } from "@/app/actions/orcamentos/delete_budget";
import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";

export default function UtilitiesOrcamento() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [state, formAction, loading] = useActionState(createBudget, null);
  const [updateState, updateFormAction, updateLoading] = useActionState(
    editBudget,
    null,
  );

  const handleSubmit = async (formData) => {
    try {
      await formAction(formData);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Orçamento criado com sucesso");
      setIsOpen(false);
    } catch {
      toast.error("Erro ao criar Orçamento.");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateFormAction(formData);
      await new Promise((r) => setTimeout(r, 1000));
      toast.info("Orçamento atualizado com sucesso");
      setIsOpen(false);
    } catch {
      toast.error("Erro ao atualizar Orçamento.");
    }
  };

  const handleDelete = (id: number) =>
    startTransition(async () => {
      try {
        await removeBudget(id);
        await new Promise((r) => setTimeout(r, 1000));
        toast.success("Orçamento removido com sucesso!");
        setIsOpen(false);
      } catch {
        toast.error("Erro ao remover Orçamento.");
      }
    });

  return {
    isOpen,
    setIsOpen,
    handleSubmit,
    handleUpdate,
    handleDelete,
    loading,
    updateLoading,
    isPending,
  };
}
