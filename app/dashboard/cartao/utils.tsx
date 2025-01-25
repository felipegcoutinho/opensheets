import { addCards, updateCards } from "@/actions/cards";
import { useState } from "react";
import { toast } from "sonner";

function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const limiteFormatado = formData
      .get("limite")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("limite", limiteFormatado);

    try {
      await addCards(formData);
      toast.success("Cartão adicionado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar Cartão.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const limiteFormatado = formData
      .get("limite")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("limite", limiteFormatado);

    try {
      await updateCards(formData);
      toast.info("Cartão atualizado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar Cartão.");
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    loading,
    handleSubmit,
    handleUpdate,
    statusPagamento,
    setStatusPagamento,
  };
}

export default Utils;
