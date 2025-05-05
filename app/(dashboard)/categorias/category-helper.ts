import {
  addCategories,
  deleteCategories,
  updateCategories,
} from "@/app/actions/categories";
import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";

export default function CategoryHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [state, formAction, loading] = useActionState(addCategories, null);
  const [updateState, updateFormAction, updateLoading] = useActionState(
    updateCategories,
    null,
  );

  const handleSubmit = async (formData) => {
    try {
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await deleteCategories(id);
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
    loading,
    updateLoading,
    state,
    isPending,
  };
}
