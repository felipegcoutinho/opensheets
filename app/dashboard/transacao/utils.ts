import UseOptions from "@/hooks/use-options";
import {
  addTransaction,
  deleteTransaction,
  removeImage,
  updateTransaction,
} from "@actions/transactions";
import { addMonths, format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

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
  const [image, setImage] = useState(null);

  const [removingImage, setRemovingImage] = useState(false);

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

    const imageFile = formData.get("imagem_url");

    // Remove o campo de imagem se nenhum arquivo válido for selecionado
    if (!(imageFile instanceof File && imageFile.size > 0)) {
      formData.delete("imagem_url");
    }

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
    const condicao = formData.get("condicao");

    if (condicao !== "Parcelado") {
      const valorFormatado = formData
        .get("valor")
        .replace(/[R$\.\s]/g, "")
        .replace(",", ".");
      formData.set("valor", valorFormatado);
    }

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

  const handleRemoveImage = async (transactionId, imageUrl) => {
    setRemovingImage(true);
    try {
      await removeImage(transactionId, imageUrl);
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      toast.success("Erro ao remover a imagem");
      console.error("Erro ao remover a imagem:", error);
    }
  };

  function MonthUppercase(itemPeriodo) {
    const data = parse(itemPeriodo, "MMMM-yyyy", new Date(), { locale: ptBR });
    let periodoFormatado = format(data, "MMMM 'de' yyyy", { locale: ptBR });
    periodoFormatado =
      periodoFormatado.charAt(0).toUpperCase() + periodoFormatado.slice(1);

    return periodoFormatado;
  }

  function calcularMesFinal(
    itemPeriodo,
    itemQtdeParcelas,
    itemParcelaAtual = 1,
  ) {
    // Parse o itemPeriodo para um objeto Date
    const dataInicial = parse(itemPeriodo, "MMMM-yyyy", new Date(), {
      locale: ptBR,
    });

    // Calcule quantas parcelas ainda faltam
    const parcelasRestantes = itemQtdeParcelas - itemParcelaAtual + 1;

    // Adicione a quantidade de parcelas restantes à data inicial
    const dataFinal = addMonths(dataInicial, parcelasRestantes - 1);

    // Formate a data final para o formato "MMMM 'de' yyyy"
    let mesFinal = format(dataFinal, "MMMM 'de' yyyy", { locale: ptBR });

    // Capitaliza a primeira letra do mês
    mesFinal = mesFinal.charAt(0).toUpperCase() + mesFinal.slice(1);

    return mesFinal;
  }

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
    MonthUppercase,
    calcularMesFinal,
    setImage,
    image,
    handleRemoveImage,
  };
}
