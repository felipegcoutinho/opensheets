"use client";

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UseDates } from "@/hooks/UseDates";
import { Eye } from "lucide-react";
import Utils from "../utils";

export default function DetailsTransactions({
  itemId,
  itemCategoria,
  itemCondicao,
  itemDescricao,
  itemNotas,
  itemDate,
  itemResponsavel,
  itemSegundoResponsavel,
  itemTipoTransacao,
  itemValor,
  itemFormaPagamento,
  itemCartao,
  itemConta,
  itemQtdeParcelas,
  getAccountMap,
  getCardsMap,
  itemPeriodo,
  itemRecorrencia,
  itemQtdeRecorrencia,
  itemPaid,
}) {
  const {
    isOpen,
    setIsOpen,
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
    getMonthOptions,
    categoriasReceita,
    categoriasDespesa,
    handleUpdate,
    loading,
    setShowConta,
    setShowCartao,
    setShowParcelas,
    setShowRecorrencia,
    isPaid,
    setIsPaid,
  } = Utils();

  const handleDialogClose = (val) => {
    setIsOpen(val);
    setShowConta(false);
    setShowCartao(false);
    setShowParcelas(false);
    setShowRecorrencia(false);
    setIsPaid(true);
  };

  const { DateFormat } = UseDates();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogTrigger>
          <Eye size={16} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
          </DialogHeader>

          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-left text-muted-foreground">Data da Compra:</div>
              <div className="text-right">{DateFormat(itemDate)}</div>

              <div className="text-left text-muted-foreground">Descrição:</div>
              <div className="text-right">{itemDescricao}</div>

              <div className="text-left text-muted-foreground">Valor:</div>
              <div className="text-right">{itemValor}</div>

              <div className="text-left text-muted-foreground">Categoria:</div>
              <div className="text-right">{itemCategoria}</div>

              <div className="text-left text-muted-foreground">Tipo de Transação:</div>
              <div className="text-right">{itemTipoTransacao}</div>

              <div className="text-left text-muted-foreground">Condição:</div>
              <div className="text-right">{itemCondicao}</div>

              {itemCondicao === "Parcelado" && (
                <>
                  <div className="text-left text-muted-foreground">Quantidade de Parcelas:</div>
                  <div className="text-right">{itemQtdeParcelas}</div>
                </>
              )}

              {itemCondicao === "Recorrente" && (
                <>
                  <div className="text-left text-muted-foreground">Quantidade de Recorrências:</div>
                  <div className="text-right">{itemQtdeRecorrencia}</div>
                </>
              )}

              <div className="text-left text-muted-foreground">Forma de Pagamento:</div>
              <div className="text-right">{itemFormaPagamento}</div>

              <div className="text-left text-muted-foreground">Responsável:</div>
              <div className="text-right">{itemResponsavel}</div>

              <div className="text-left text-muted-foreground">Segundo Responsável:</div>
              <div className="text-right">{itemSegundoResponsavel}</div>

              <div className="text-left text-muted-foreground">Notas:</div>
              <div className="text-right">{itemNotas}</div>

              <div className="text-left text-muted-foreground">Status:</div>
              <div className="text-right">{itemPaid ? "Pago" : "Pendente"}</div>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
