import { addCards, updateCards } from "@/actions/cards";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export default function UtilitiesCartao() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, loading] = useActionState(addCards, null);
  const [updateState, updateFormAction, updateLoading] = useActionState(
    updateCards,
    null,
  );
  const [statusPagamento, setStatusPagamento] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const rawLimite = formData.get("limite");
    if (rawLimite) {
      const limiteFormatado = rawLimite
        .toString()
        .replace(/[R$\.\s]/g, "")
        .replace(",", ".");
      formData.set("limite", limiteFormatado);
    }
    try {
      await formAction(formData);
      toast.success("Cartão adicionado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar Cartão.");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    const rawLimite = formData.get("limite");
    if (rawLimite) {
      const limiteFormatado = rawLimite
        .toString()
        .replace(/[R$\.\s]/g, "")
        .replace(",", ".");
      formData.set("limite", limiteFormatado);
    }
    try {
      await updateFormAction(formData);
      toast.info("Cartão atualizado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar Cartão.");
    }
  };

  return {
    isOpen,
    setIsOpen,
    loading,
    updateLoading,
    handleSubmit,
    handleUpdate,
    statusPagamento,
    setStatusPagamento,
  };
}
