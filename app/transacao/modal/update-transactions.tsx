"use client";

import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ThumbsUp } from "lucide-react";
import { useEffect } from "react";
import Utils from "../utils";

export default function UpdateTransactions({
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

  // Inicializa o estado de `isPaid` com o valor do item quando o modal for aberto
  useEffect(() => {
    setIsPaid(itemPaid); // Inicializa `isPaid` com o valor atual da transação
  }, [itemPaid, setIsPaid]);

  const handleDialogClose = (val) => {
    setIsOpen(val);
    if (!val) {
      // Se o modal for fechado, resetar `isPaid` para o valor original
      setIsPaid(itemPaid);
      setShowConta(false);
      setShowCartao(false);
      setShowParcelas(false);
      setShowRecorrencia(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger disabled={itemResponsavel === "Sistema"}>
        <span className={`${itemResponsavel === "Sistema" && "hidden"}`}>
          Editar
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate}>
          <input type="hidden" name="id" value={itemId} />

          <div className="mb-1 flex w-full gap-2">
            <div className="w-1/2">
              <Label>Data da Compra</Label>
              <Required />
              <Input defaultValue={itemDate} name="data_compra" type="date" />
            </div>

            <div className="w-1/2">
              <Label>Período</Label>
              <Required />
              <Select defaultValue={itemPeriodo} name="periodo">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getMonthOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>Descrição</Label>
              <Required />
              <Input
                defaultValue={itemDescricao}
                name="descricao"
                placeholder="Descrição"
                type="text"
              />
            </div>

            <div className="w-1/2">
              <Label>Valor</Label>
              <Required />
              <MoneyInput
                defaultValue={itemValor}
                name="valor"
                disabled={itemCondicao === "Parcelado"}
              />
            </div>
          </div>

          <div className="mt-1 flex w-full gap-2">
            <div className="w-full">
              <Label>Categoria</Label>
              <Select defaultValue={itemCategoria} name="categoria">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {itemTipoTransacao === "Receita" &&
                    categoriasReceita.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}

                  {itemTipoTransacao === "Despesa" &&
                    categoriasDespesa.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="mt-2 flex w-full items-center justify-between gap-2 px-2">
            <Label className="text-sm font-medium text-neutral-600">
              Marcar lançamento como Pago{" "}
            </Label>
            <Toggle
              onPressedChange={() => setIsPaid(!isPaid)} // Altere o valor apenas quando o usuário interagir
              defaultPressed={isPaid} // Valor inicial vem da transação atual
              name="realizado"
              className="hover:bg-transparent data-[state=on]:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:text-green-400"
            >
              <ThumbsUp strokeWidth={2} className="h-6 w-6" />
            </Toggle>
          </Card>

          <div className="w-full">
            <Label>Responsável</Label>
            <Required />
            <Input
              defaultValue={itemResponsavel}
              name="responsavel"
              placeholder="Responsável"
              type="text"
            />
          </div>

          <div className="mb-1 flex w-full gap-2">
            <div className="w-full">
              <Label>Anotação</Label>
              <Textarea
                defaultValue={itemNotas}
                name="anotacao"
                placeholder="Anotação"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose asChild>
              <Button className="w-1/2" type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>

            <Button className="w-1/2" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
