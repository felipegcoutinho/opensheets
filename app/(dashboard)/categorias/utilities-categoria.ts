import { createCategory } from "@/app/actions/categories/create_categories";
import { removeCategory } from "@/app/actions/categories/delete_categories";
import { editCategory } from "@/app/actions/categories/update_categories";
import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";

export default function UtilitiesCategoria() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUsedForCalculations, setIsUsedForCalculations] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [state, formAction, loading] = useActionState(createCategory, null);
  const [updateState, updateFormAction, updateLoading] = useActionState(
    editCategory,
    null,
  );

  const handleSubmit = async (formData) => {
    try {
      formData.append("usado_para_calculos", isUsedForCalculations);
      await formAction(formData);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Categoria adicionada com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar Categoria.");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      formData.append("usado_para_calculos", isUsedForCalculations);
      await updateFormAction(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info("Categoria atualizada com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar Categoria.");
    }
  };

  // const handleDelete = async (itemId) => {
  //   startTransition(async () => {
  //     try {
  //       const formData = new FormData();
  //       formData.append("excluir", itemId);
  //       await deleteFormAction(formData);
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       toast.success("Categoria removida com sucesso!");
  //       setIsOpen(false);
  //     } catch (error) {
  //       toast.error("Erro ao remover categoria.");
  //     }
  //   });
  // };

  const handleDelete = async (id) => {
    startTransition(async () => {
      try {
        await removeCategory(id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Categoria removida com sucesso!");
        setIsOpen(false);
      } catch (error) {
        toast.error("Erro ao remover categoria.");
      }
    });
  };

  return {
    isOpen,
    setIsOpen,
    handleSubmit,
    handleUpdate,
    handleDelete,
    loading,
    updateLoading,
    state,
    isPending,
    isUsedForCalculations,
    setIsUsedForCalculations,
  };
}
