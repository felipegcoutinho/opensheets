import { addInvest, deleteInvest, updateInvest } from "@/app/actions/invest";
import { useState } from "react";
import { toast } from "sonner";

export default function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const valorFormatado = formData
      .get("valor")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("valor", valorFormatado);

    await addInvest(formData);
    toast.success("Investimento adicionada com sucesso!");
    setIsOpen(false);
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const valorFormatado = formData
      .get("valor")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("valor", valorFormatado);

    await updateInvest(formData);
    toast.success("Investimento atualizada com sucesso!");
    setIsOpen(false);
    setLoading(false);
  };

  const handleDelete = (itemId) => async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("excluir", itemId);
    await deleteInvest(formData);
    toast.success("Investimento removida com sucesso!");
    setIsOpen(false);
  };

  return {
    loading,
    setLoading,
    isOpen,
    setIsOpen,
    handleSubmit,
    handleUpdate,
    handleDelete,
  };
}
