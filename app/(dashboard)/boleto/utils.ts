import { addBills, deleteBills, updateBills } from "@/actions/bills";
import { useToast } from "@/components/ui/use-toast";
import UseOptions from "@/hooks/use-options";
import { useState } from "react";

export default function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDividedChecked, setIsDividedChecked] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState(false);
  const { categoriasDespesa } = UseOptions();
  const [showRecorrencia, setShowRecorrencia] = useState(false);

  const { toast } = useToast();

  const handleCondicaoChange = (value) => {
    setShowRecorrencia(value === "Recorrente");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const valorFormatado = formData
      .get("valor")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("valor", valorFormatado);

    await addBills(formData);
    toast({
      variant: "success",
      title: "Sucesso!",
      description: "Boleto adicionado com sucesso!",
    });
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

    await updateBills(formData);
    toast({
      variant: "updated",
      title: "Sucesso!",
      description: "Boleto atualizado com sucesso!",
    });
    setIsOpen(false);
    setLoading(false);
  };

  const handleDelete = (itemId) => async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("excluir", itemId);
    await deleteBills(formData);

    toast({
      variant: "success",
      title: "Sucesso!",
      description: "Boleto removido com sucesso!",
    });
    setIsOpen(false);
  };

  return {
    loading,
    handleSubmit,
    handleUpdate,
    statusPagamento,
    setStatusPagamento,
    categoriasDespesa,
    showRecorrencia,
    handleCondicaoChange,
    isDividedChecked,
    setIsDividedChecked,
    isOpen,
    setIsOpen,
    handleDelete,
  };
}
