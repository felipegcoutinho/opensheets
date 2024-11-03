import { useToast } from "@/components/ui/use-toast";
import UseOptions from "@/hooks/use-options";
import { addBills, deleteBills, updateBills } from "@actions/bills";
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

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const { optionsMeses } = UseOptions();

    for (let i = -2; i <= 2; i++) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      const month = optionsMeses[newDate.getMonth()];
      const year = newDate.getFullYear();
      const value = `${month}-${year}`;
      options.push({
        value,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`,
      });
    }

    return options;
  };

  return {
    loading,
    handleSubmit,
    handleUpdate,
    getMonthOptions,
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
