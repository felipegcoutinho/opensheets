import { createCard } from "@/app/actions/cards/create_cards";
import { updateCard } from "@/app/actions/cards/update_cards";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export default function UtilitiesCartao() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, loading] = useActionState(createCard, null);
  const [updateState, updateFormAction, updateLoading] = useActionState(
    updateCard,
    null,
  );

  const handleSubmit = async (formData: FormData) => {
    try {
      await formAction(formData);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Cartão adicionado com sucesso!");
      setIsOpen(false);
    } catch {
      toast.error("Erro ao adicionar Cartão.");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      await updateFormAction(formData);
      await new Promise((r) => setTimeout(r, 1000));
      toast.info("Cartão atualizado com sucesso!");
      setIsOpen(false);
    } catch {
      toast.error("Erro ao atualizar Cartão.");
    }
  };

  return {
    isOpen,
    setIsOpen,
    handleSubmit,
    handleUpdate,
    loading,
    updateLoading,
  };
}
