import UseOptions from "@/hooks/UseOptions";
import { useState } from "react";
import { toast } from "sonner";
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
  const [isPaid, setIsPaid] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    // Formatação do valor antes de enviar
    const valorFormatado = formData
      .get("valor")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("valor", valorFormatado);

    formData.append("realizado", isPaid);
    await addTransaction(formData);
    toast.success("Transação adicionada com sucesso!");
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

    formData.append("realizado", isPaid);
    await updateTransaction(formData);
    toast.success("Transação atualizada com sucesso!");
    setIsOpen(false);
    setLoading(false);
  };

  const handleDelete = (itemId) => async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("excluir", itemId);
    await deleteTransaction(formData);
    toast.success("Transação removida com sucesso!");
    setIsOpen(false);
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

  const handleDialogClose = (val) => {
    setIsOpen(val);
    setIsDividedChecked(false);
    setShowConta(false);
    setShowCartao(false);
    setShowParcelas(false);
    setShowRecorrencia(false);
    setIsEfetivadoChecked(true);
    setIsPaid(true);
  };

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
    isEfetivadoChecked,
    setIsEfetivadoChecked,
    isDividedChecked,
    setIsDividedChecked,
    handleDialogClose,
    isPaid,
    setIsPaid,
  };
}
