import {
  addTransaction,
  removeImage,
} from "@/app/actions/transactions/create_transactions ";
import { deleteTransaction } from "@/app/actions/transactions/delete_transactions";
import { updateTransaction } from "@/app/actions/transactions/update_transactions";
import { addMonths, format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react"; // Removido useEffect não utilizado aqui
import { toast } from "sonner";

export default function UtilitiesLancamento() {
  const [isOpen, setIsOpen] = useState(false);
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
  const [formaPagamentoAtual, setFormaPagamentoAtual] = useState("");

  const eBoletoSelecionado = formaPagamentoAtual === "boleto";

  const handleCondicaoChange = (value: string) => {
    setShowParcelas(value === "parcelado");
    setShowRecorrencia(value === "recorrente");
    if (value !== "parcelado") {
      setQuantidadeParcelas("");
    }
  };

  const handleTipoTransacaoChange = (value: string) => {
    setTipoTransacao(value);
  };

  const handleFormaPagamentoChange = (value: string) => {
    setFormaPagamentoAtual(value);
    const isCartaoCredito = value === "cartão de crédito";
    const isBoleto = value === "boleto";
    const showContaInput = [
      "dinheiro",
      "pix",
      "cartão de débito",
      "boleto",
    ].includes(value);

    setShowConta(showContaInput);
    setShowCartao(isCartaoCredito);

    if (isBoleto || isCartaoCredito) {
      setIsPaid(false);
    } else {
      setIsPaid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const imageFile = formData.get("imagem_url");

    if (!(imageFile instanceof File && imageFile.size > 0)) {
      formData.delete("imagem_url");
    }

    const valorFormatado = formData
      .get("valor")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("valor", valorFormatado);

    // if (eBoletoSelecionado) {
    //   formData.set("data_compra", ""); // Data da compra nula para boleto
    //   // O campo data_vencimento_boleto já estará no formData se visível
    // }

    // Garante que 'realizado' reflita o estado de 'isPaid'
    // Para boleto, isPaid é false, então 'realizado' será "false"
    formData.append("realizado", String(isPaid));

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

    if (condicao !== "parcelado") {
      const valorFormatado = formData
        .get("valor")
        .replace(/[R$\.\s]/g, "")
        .replace(",", ".");
      formData.set("valor", valorFormatado);
    }

    if (eBoletoSelecionado) {
      formData.set("data_compra", "");
    }
    formData.append("realizado", String(isPaid));

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
      toast.error("Erro ao remover a imagem");
      console.error("Erro ao remover a imagem:", error);
    }
    setRemovingImage(false);
  };

  function MonthUppercase(itemPeriodo) {
    if (!itemPeriodo) return "";
    const data = parse(itemPeriodo, "MMMM-yyyy", new Date(), { locale: ptBR });
    let periodoFormatado = format(data, "MMMM 'de' yyyy", { locale: ptBR }); // yyyy minúsculo
    periodoFormatado =
      periodoFormatado.charAt(0).toUpperCase() + periodoFormatado.slice(1);
    return periodoFormatado;
  }

  function calcularMesFinal(
    itemPeriodo,
    itemQtdeParcelas,
    itemParcelaAtual = 1,
  ) {
    if (!itemPeriodo) return "";
    const dataInicial = parse(itemPeriodo, "MMMM-yyyy", new Date(), {
      locale: ptBR,
    });
    const parcelasRestantes = itemQtdeParcelas - itemParcelaAtual + 1;
    const dataFinal = addMonths(dataInicial, parcelasRestantes - 1);
    let mesFinal = format(dataFinal, "MMMM 'de' yyyy", { locale: ptBR }); // yyyy minúsculo
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
    setIsPaid(true);
    setFormaPagamentoAtual("");
    setImage(null);
    setTipoTransacao("");
    setQuantidadeParcelas("");
  };

  return {
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
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    handleSubmit,
    handleDelete,
    loading,
    setLoading,
    handleUpdate,
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
    removingImage,
    eBoletoSelecionado,
    formaPagamentoAtual,
  };
}
