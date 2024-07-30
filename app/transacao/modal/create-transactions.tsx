"use client";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Utils from "../utils";

export default function CreateTransactions({ getCardsMap, getAccountMap }) {
  const {
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
    setShowConta,
    setShowCartao,
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    getMonthOptions,
    categoriasReceita,
    categoriasDespesa,
    handleSubmit,
    loading,
    setLoading,
    isEfetivadoChecked,
    setIsEfetivadoChecked,
    isDividedChecked,
    setIsDividedChecked,
    setShowParcelas,
    setShowRecorrencia,
  } = Utils();

  const handleDialogClose = (val) => {
    setIsOpen(val);
    setIsDividedChecked(false);
    setShowConta(false);
    setShowCartao(false);
    setShowParcelas(false);
    setShowRecorrencia(false);
    setIsEfetivadoChecked(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button>Nova Transação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex w-full gap-2 mb-1">
            <div className="w-1/2">
              <Label>Data da Compra</Label>
              <Required />
              <Input name="data_compra" type="date" />
            </div>

            <div className="w-1/2">
              <Label>Período</Label>
              <Required />
              <Select name="periodo">
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
              <Input name="descricao" placeholder="Descrição" type="text" />
            </div>

            <div className="w-1/2">
              <Label>Valor</Label>
              <Required />
              <Input name="valor" placeholder="Valor" type="number" />
            </div>
          </div>

          <div className="flex w-full gap-2 mt-1">
            <div className="w-1/2">
              <Label>Tipo de Transação</Label>
              <Select name="tipo_transacao" onValueChange={handleTipoTransacaoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/2">
              <Label>Categoria</Label>
              <Select name="categoria" disabled={tipoTransacao !== "Receita" && tipoTransacao !== "Despesa"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {tipoTransacao === "Receita" &&
                    categoriasReceita.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}

                  {tipoTransacao === "Despesa" &&
                    categoriasDespesa.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="flex items-center mt-2 justify-between rounded-lg bg-transparent border p-2">
            <Label>Dividir Lançamento</Label>
            <Switch name="dividir_lancamento" checked={isDividedChecked} onCheckedChange={() => setIsDividedChecked(!isDividedChecked)} />
          </Card>

          <div className="flex w-full gap-2">
            <div className="w-full">
              <Label>Responsável</Label>
              <Required />
              <Input name="responsavel" placeholder="Responsável" type="text" />
            </div>

            {isDividedChecked && (
              <div className="w-full">
                <Label>Segundo Responsável</Label>
                <Input name="segundo_responsavel" placeholder="Segundo Responsável" type="text" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className={showConta || showCartao ? "w-1/2" : "w-full"}>
              <Label>Forma de Pagamento</Label>
              <Required />
              <Select name="forma_pagamento" onValueChange={(value) => handleFormaPagamentoChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showConta && (
              <div className="w-1/2">
                <Label>Contas</Label>
                <Required />
                <Select name="conta_id" placeholder="Selecione">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAccountMap.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showCartao && (
              <div className="w-1/2">
                <Label>Cartão</Label>
                <Required />
                <Select name="cartao_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCardsMap.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex w-full gap-2">
            <div className={showParcelas || showRecorrencia ? "w-1/2" : "w-full"}>
              <Label>Condição</Label>
              <Select name="condicao" onValueChange={handleCondicaoChange} defaultValue="Vista">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vista">À Vista</SelectItem>
                  <SelectItem value="Parcelado">Parcelado</SelectItem>
                  <SelectItem value="Recorrente">Recorrente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showParcelas && (
              <div className="w-1/2">
                <Label>Quantidade de Parcelas</Label>
                <Select
                  name="qtde_parcela"
                  value={quantidadeParcelas}
                  onValueChange={(value) => setQuantidadeParcelas(value)}
                  placeholder="Selecione"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="3">3x</SelectItem>
                    <SelectItem value="4">4x</SelectItem>
                    <SelectItem value="5">5x</SelectItem>
                    <SelectItem value="6">6x</SelectItem>
                    <SelectItem value="7">7x</SelectItem>
                    <SelectItem value="8">8x</SelectItem>
                    <SelectItem value="9">9x</SelectItem>
                    <SelectItem value="10">10x</SelectItem>
                    <SelectItem value="11">11x</SelectItem>
                    <SelectItem value="12">12x</SelectItem>
                    <SelectItem value="13">13x</SelectItem>
                    <SelectItem value="14">14x</SelectItem>
                    <SelectItem value="15">15x</SelectItem>
                    <SelectItem value="16">16x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showRecorrencia && (
              <div className="w-1/2">
                <Label>Quant. recorrencia</Label>
                <Select name="qtde_recorrencia">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Por 2 meses</SelectItem>
                    <SelectItem value="3">Por 3 meses</SelectItem>
                    <SelectItem value="4">Por 4 meses</SelectItem>
                    <SelectItem value="5">Por 5 meses</SelectItem>
                    <SelectItem value="6">Por 6 meses</SelectItem>
                    <SelectItem value="7">Por 7 meses</SelectItem>
                    <SelectItem value="8">Por 8 meses</SelectItem>
                    <SelectItem value="9">Por 9 meses</SelectItem>
                    <SelectItem value="10">Por 10 meses</SelectItem>
                    <SelectItem value="11">Por 11 meses</SelectItem>
                    <SelectItem value="12">Por 12 meses</SelectItem>
                    <SelectItem value="13">Por 13 meses</SelectItem>
                    <SelectItem value="14">Por 14 meses</SelectItem>
                    <SelectItem value="15">Por 15 meses</SelectItem>
                    <SelectItem value="16">Por 16 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex w-full gap-2 mb-1">
            <div className="w-full">
              <Label>Anotação</Label>
              <Textarea name="anotacao" placeholder="Anotação" />
            </div>
          </div>

          <DialogFooter className="flex gap-2 mt-4">
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
