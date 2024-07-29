import { useToast } from "@/components/ui/use-toast";
import UseOptions from "@/hooks/UseOptions";
import { useState } from "react";
import { addTransaction, deleteTransaction, updateTransaction } from "../actions/transactions";

export default function Utils() {
  const { categoriasReceita, categoriasDespesa } = UseOptions();

  const [isOpen, setIsOpen] = useState(false);

  const [isEfetivadoChecked, setIsEfetivadoChecked] = useState(true);

  const [tipoTransacao, setTipoTransacao] = useState("");

  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  const [showParcelas, setShowParcelas] = useState(false);

  const [showRecorrencia, setShowRecorrencia] = useState(false);

  const [showConta, setShowConta] = useState(false);

  const [showCartao, setShowCartao] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isDividedChecked, setIsDividedChecked] = useState(false);

  const { toast } = useToast();

  const handleCondicaoChange = (value: string) => {
    setShowParcelas(value === "Parcelado");
    setShowRecorrencia(value === "Recorrente");

    if (value !== "Parcelado") {
      setQuantidadeParcelas("");
    }
  };

  const handleTipoTransacaoChange = (value: string) => {
    setTipoTransacao(value);
  };

  const handleFormaPagamentoChange = (value: string) => {
    const isConta = ["Dinheiro", "Pix", "Cartão de Débito"].includes(value);
    setShowConta(isConta);
    setShowCartao(!isConta);
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const { optionsMeses } = UseOptions();

    for (let i = -2; i <= 2; i++) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const month = optionsMeses[newDate.getMonth()];
      const year = newDate.getFullYear();
      const value = `${month}-${year}`;
      options.push({ value, label: `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}` });
    }

    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await addTransaction(formData);
      alert("Transação adicionada com sucesso!");
      setIsOpen(false);
    } catch (error) {
      alert("Erro ao adicionar transação.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await updateTransaction(formData);
      alert("Transação atualizada com sucesso!");
      setIsOpen(false);
    } catch (error) {
      alert("Erro ao atualizar transação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (itemId) => async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("excluir", itemId);
    await deleteTransaction(formData);
    toast({
      variant: "success",
      title: "Sucesso!",
      description: "Transação removida com sucesso!",
    });
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).format(date).replace(".", "").replace(" de", "");
  }

  return {
    categoriasReceita,
    categoriasDespesa,
    isOpen,
    setIsOpen,
    tipoTransacao,
    setTipoTransacao,
    quantidadeParcelas,
    setQuantidadeParcelas,
    showParcelas,
    showRecorrencia,
    showConta,
    showCartao,
    setShowParcelas,
    setShowRecorrencia,
    setShowConta,
    setShowCartao,
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    getMonthOptions,
    handleSubmit,
    handleDelete,
    loading,
    setLoading,
    handleUpdate,
    formatDate,
    isEfetivadoChecked,
    setIsEfetivadoChecked,
    isDividedChecked,
    setIsDividedChecked,
  };
}
