import { addPayers, updatePayers } from "@/app/actions/payers/payers";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export default function UtilitiesPagador() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, loading] = useActionState(addPayers, null);
  const [updateState, updateAction, updateLoading] = useActionState(
    updatePayers,
    null,
  );

  const handleSubmit = async (formData) => {
    try {
      await action(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Pagador criado com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao criar Pagador.");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateAction(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info("Anotação atualizada com sucesso");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar Anotação.");
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleSubmit,
    handleUpdate,
    loading,
    updateLoading,
    state,
    updateState,
  };
}
