"use client";

import { createTransaction } from "@/app/actions/transactions/create_transactions";
import {
  deleteTransaction,
  removeImage,
} from "@/app/actions/transactions/delete_transactions";
import { updateTransaction } from "@/app/actions/transactions/update_transactions";
import { addMonths, format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useState, type FormEvent } from "react";
import { toast } from "sonner";

type TransactionFormEvent = FormEvent<HTMLFormElement>;

function normalizeCurrencyValue(value: FormDataEntryValue | null): string {
  if (!value) return "";
  return String(value)
    .replace(/[R$\.\s]/g, "")
    .replace(",", ".");
}

export function formatPeriodoLabel(itemPeriodo?: string | null) {
  if (!itemPeriodo) return "";
  const data = parse(itemPeriodo, "MMMM-yyyy", new Date(), { locale: ptBR });
  const formatted = format(data, "MMMM 'de' yyyy", { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function calcularMesFinal(
  itemPeriodo?: string | null,
  itemQtdeParcelas?: number,
  itemParcelaAtual = 1,
) {
  if (!itemPeriodo || !itemQtdeParcelas) return "";
  const dataInicial = parse(itemPeriodo, "MMMM-yyyy", new Date(), {
    locale: ptBR,
  });
  const parcelasRestantes = itemQtdeParcelas - itemParcelaAtual + 1;
  const dataFinal = addMonths(dataInicial, parcelasRestantes - 1);
  const formatted = format(dataFinal, "MMMM 'de' yyyy", { locale: ptBR });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function UtilitiesLancamento() {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState("");
  const [condicao, setCondicao] = useState("vista");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDividedChecked, setIsDividedChecked] = useState(false);
  const [isPaid, setIsPaid] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [removingImage, setRemovingImage] = useState(false);

  const isParcelado = condicao === "parcelado";
  const isRecorrente = condicao === "recorrente";
  const showConta = ["dinheiro", "pix", "cartão de débito", "boleto"].includes(
    paymentMethod,
  );
  const showCartao = paymentMethod === "cartão de crédito";
  const eBoletoSelecionado = paymentMethod === "boleto";

  const handleCondicaoChange = useCallback((value: string) => {
    setCondicao(value);
    if (value !== "parcelado") {
      setQuantidadeParcelas("");
    }
  }, []);

  const handleTipoTransacaoChange = useCallback((value: string) => {
    setTipoTransacao(value);
  }, []);

  const handleFormaPagamentoChange = useCallback((value: string) => {
    setPaymentMethod(value);

    const exigeComprovante =
      value === "boleto" || value === "cartão de crédito";
    setIsPaid(!exigeComprovante);
  }, []);

  const handleDialogClose = useCallback((value: boolean) => {
    setIsOpen(value);
    if (!value) {
      setIsDividedChecked(false);
      setPaymentMethod("");
      setCondicao("vista");
      setQuantidadeParcelas("");
      setIsPaid(true);
      setImage(null);
      setTipoTransacao("");
    }
  }, []);

  const handleCreateSubmit = useCallback(
    async (event: TransactionFormEvent) => {
      event.preventDefault();
      setLoading(true);

      const form = event.currentTarget;
      const formData = new FormData(form);
      const imageFile = formData.get("imagem_url");

      if (!(imageFile instanceof File && imageFile.size > 0)) {
        formData.delete("imagem_url");
      }

      formData.set("valor", normalizeCurrencyValue(formData.get("valor")));
      formData.set("realizado", String(isPaid));

      const result = await createTransaction(
        { success: false, message: "" },
        formData,
      );

      if (!result.success) {
        toast.error(result.message || "Erro ao adicionar lançamento.");
        setLoading(false);
        return;
      }

      toast.success(result.message || "Transação adicionada com sucesso!");

      handleDialogClose(false);
      setLoading(false);
    },
    [handleDialogClose, isPaid],
  );

  const handleUpdate = useCallback(async (event: TransactionFormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const condicaoSelecionada = String(formData.get("condicao") ?? "");

    if (condicaoSelecionada !== "parcelado") {
      formData.set("valor", normalizeCurrencyValue(formData.get("valor")));
    }

    formData.delete("realizado");

    const result = await updateTransaction(
      { success: false, message: "" },
      formData,
    );

    if (!result.success) {
      toast.error(result.message || "Erro ao atualizar a transação.");
      setLoading(false);
      return;
    }

    toast.success(result.message || "Transação atualizada com sucesso!");
    setIsOpen(false);
    setLoading(false);
  }, []);

  const handleDelete = useCallback(
    (itemId: number | string) => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("excluir", String(itemId));
      await deleteTransaction({ success: false, message: "" }, formData);
      toast.success("Transação removida com sucesso!");
      setIsOpen(false);
    },
    [],
  );

  const handleRemoveImage = useCallback(
    async (transactionId: number | string, imageUrl: string) => {
      setRemovingImage(true);
      try {
        await removeImage(Number(transactionId), imageUrl);
        toast.success("Imagem removida com sucesso!");
      } catch (error) {
        toast.error("Erro ao remover a imagem");
        console.error("Erro ao remover a imagem:", error);
      }
      setRemovingImage(false);
    },
    [],
  );

  return {
    isOpen,
    setIsOpen,
    tipoTransacao,
    setTipoTransacao,
    condicao,
    setCondicao,
    quantidadeParcelas,
    setQuantidadeParcelas,
    isParcelado,
    isRecorrente,
    showConta,
    showCartao,
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    handleCreateSubmit,
    handleDelete,
    loading,
    handleUpdate,
    isDividedChecked,
    setIsDividedChecked,
    handleDialogClose,
    isPaid,
    setIsPaid,
    setImage,
    image,
    handleRemoveImage,
    removingImage,
    eBoletoSelecionado,
  };
}
