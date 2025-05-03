import { addNotes, deleteNotes, updateNotes } from "@/actions/notes";
import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";

export default function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [state, formAction, loading] = useActionState(addNotes, null);
  const [updateState, updateFormAction, updateLoading] = useActionState(
    updateNotes,
    null,
  );
  const [deleteState, deleteFormAction] = useActionState(deleteNotes, null);

  const handleSubmit = async (formData) => {
    try {
      await formAction(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Anotação criada com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao criar Anotação.");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateFormAction(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info("Anotação atualizada com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar Anotação.");
    }
  };

  const handleDelete = (itemId) => async () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("excluir", itemId);
        await deleteFormAction(formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsOpen(false);
      } catch (error) {
        console.error(error, "Erro ao remover Anotação.");
      }
    });
  };

  return {
    loading,
    updateLoading,
    isPending,
    handleSubmit,
    handleUpdate,
    isOpen,
    setIsOpen,
    handleDelete,
  };
}
