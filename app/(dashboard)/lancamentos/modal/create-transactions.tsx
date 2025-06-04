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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { UseDates } from "@/hooks/use-dates";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import UtilitiesLancamento from "../utilities-lancamento";

export default function CreateTransactions({
  getCards,
  getAccount,
  getCategorias,
  children,
}) {
  const {
    isOpen,
    tipoTransacao,
    quantidadeParcelas,
    showParcelas,
    showRecorrencia,
    showConta,
    showCartao,
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    handleSubmit,
    loading,
    isDividedChecked,
    setIsDividedChecked,
    handleDialogClose,
    isPaid,
    setIsPaid,
    setImage,
    image,
    setQuantidadeParcelas,
    eBoletoSelecionado,
  } = UtilitiesLancamento();

  const { getMonthOptions } = UseDates();

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>
        <div className="-mx-6 max-h-[530px] overflow-y-auto px-6">
          <form
            id="transaction-form"
            onSubmit={handleSubmit}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="data_compra">
                  Data da Transação <Required />
                </Label>
                <Input
                  id="data_compra"
                  name="data_compra"
                  type="date"
                  required={!eBoletoSelecionado}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="periodo">
                  Período <Required />
                </Label>
                <Select name="periodo" required>
                  <SelectTrigger id="periodo" className="w-full">
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
                <Label htmlFor="descricao">
                  Descrição <Required />
                </Label>
                <Input
                  id="descricao"
                  name="descricao"
                  placeholder="Descrição"
                  type="text"
                  required
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="valor">
                  Valor <Required />
                </Label>
                <MoneyInput
                  id="valor"
                  name="valor"
                  placeholder="R$ 0,00"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="tipo_transacao">Tipo de Transação</Label>
                <Select
                  required
                  name="tipo_transacao"
                  onValueChange={handleTipoTransacaoChange}
                  value={tipoTransacao}
                >
                  <SelectTrigger id="tipo_transacao" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <Label htmlFor="categoria_id">
                  Categoria <Required />
                </Label>
                <Select name="categoria_id" disabled={!tipoTransacao}>
                  <SelectTrigger id="categoria_id" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategorias
                      ?.filter(
                        (categoria) =>
                          categoria.tipo_categoria === tipoTransacao,
                      )
                      .map((item) => (
                        <SelectItem
                          className="capitalize"
                          key={item.id}
                          value={item.id.toString()}
                        >
                          {item.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <Card
                className={`flex-row p-4 ${
                  showCartao || eBoletoSelecionado ? "w-full" : "w-1/2"
                } `}
              >
                <div className="flex-col">
                  <Label>Dividir Lançamento</Label>
                  <p className="text-muted-foreground text-xs leading-snug">
                    Dividir o lançamento para um responsável diferente.
                  </p>
                </div>
                <div>
                  <Switch
                    name="dividir_lancamento"
                    checked={isDividedChecked}
                    onCheckedChange={setIsDividedChecked}
                  />
                </div>
              </Card>

              {!(showCartao || eBoletoSelecionado) && (
                <Card className="w-1/2 flex-row p-4">
                  <div className="flex-col">
                    <Label>Status do Lançamento</Label>
                    <p className="text-muted-foreground text-xs leading-snug">
                      Marcar o lançamento como realizado.
                    </p>
                  </div>
                  <div>
                    <Toggle
                      onPressedChange={setIsPaid}
                      pressed={isPaid}
                      name="realizado_toggle"
                      className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-400"
                    >
                      <ThumbsUp strokeWidth={2} />
                    </Toggle>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex w-full gap-2">
              <div className="w-full">
                <Label htmlFor="responsavel">
                  Responsável <Required />
                </Label>
                <Input
                  required
                  list="responsavel-list"
                  id="responsavel"
                  name="responsavel"
                  placeholder="Responsável"
                  type="text"
                  defaultValue="você"
                />
                <datalist id="responsavel-list">
                  <option value="você" />
                </datalist>
              </div>
              {isDividedChecked && (
                <div className="w-full">
                  <Label htmlFor="segundo_responsavel">
                    Segundo Responsável
                  </Label>
                  <Input
                    id="segundo_responsavel"
                    name="segundo_responsavel"
                    placeholder="Segundo Responsável"
                    type="text"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex w-full gap-2">
                <div className={showConta || showCartao ? "w-1/2" : "w-full"}>
                  <Label htmlFor="forma_pagamento">
                    Forma de Pagamento <Required />
                  </Label>
                  <Select
                    required
                    name="forma_pagamento"
                    onValueChange={handleFormaPagamentoChange}
                  >
                    <SelectTrigger id="forma_pagamento" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartão de débito">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="cartão de crédito">
                        Cartão de Crédito
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mostra Contas se showConta for true (agora inclui boleto) */}
                {showConta && (
                  <div className="w-1/2">
                    <Label htmlFor="conta_id">
                      Contas <Required />
                    </Label>
                    <Select
                      name="conta_id"
                      placeholder="Selecione"
                      required={showConta}
                    >
                      <SelectTrigger id="conta_id" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAccount?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Image
                                quality={100}
                                src={`/logos/${item.logo_image}`}
                                className="h-8 w-8 rounded-full border"
                                width={32}
                                height={32}
                                alt="Logo da Conta"
                              />
                              <span>{item.descricao}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showCartao && (
                  <div className="w-1/2">
                    <Label htmlFor="cartao_id">
                      Cartão <Required />
                    </Label>
                    <Select name="cartao_id" required={showCartao}>
                      <SelectTrigger id="cartao_id" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCards?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Image
                                quality={100}
                                src={`/logos/${item.logo_image}`}
                                className="h-8 w-8 rounded-full border"
                                width={32}
                                height={32}
                                alt="Logo do cartão"
                              />
                              <span>{item.descricao}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Data de Vencimento do Boleto - Mostra apenas se for boleto */}
              {eBoletoSelecionado && (
                <div className="w-full">
                  <Label htmlFor="data_vencimento">
                    Data de Vencimento do Boleto <Required />
                  </Label>
                  <Input
                    id="data_vencimento"
                    name="data_vencimento"
                    type="date"
                    required={eBoletoSelecionado}
                  />
                </div>
              )}
            </div>

            <div className="flex w-full gap-2">
              <div
                className={showParcelas || showRecorrencia ? "w-1/2" : "w-full"}
              >
                <Label htmlFor="condicao">Condição</Label>
                <Select
                  name="condicao"
                  onValueChange={handleCondicaoChange}
                  defaultValue="vista"
                  required
                >
                  <SelectTrigger id="condicao" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vista">À Vista</SelectItem>
                    <SelectItem value="parcelado">Parcelado</SelectItem>
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showParcelas && (
                <div className="w-1/2">
                  <Label htmlFor="qtde_parcela">Parcelado em</Label>
                  <Select
                    name="qtde_parcela"
                    value={quantidadeParcelas}
                    onValueChange={setQuantidadeParcelas}
                  >
                    <SelectTrigger id="qtde_parcela" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(15)].map((_, i) => (
                        <SelectItem key={i + 2} value={(i + 2).toString()}>
                          {i + 2}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {showRecorrencia && (
                <div className="w-1/2">
                  <Label htmlFor="qtde_recorrencia">Lançamento fixo</Label>
                  <Select name="qtde_recorrencia">
                    <SelectTrigger id="qtde_recorrencia" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(15)].map((_, i) => (
                        <SelectItem key={i + 2} value={(i + 2).toString()}>
                          Por {i + 2} meses
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="w-full">
              <Label htmlFor="imagem_url_input">Anexo</Label>
              <Input
                id="imagem_url_input"
                className="border-muted-foreground border-dotted"
                type="file"
                name="imagem_url"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="w-full flex-row gap-2">
              <Label htmlFor="anotacao">Anotação</Label>
              <Textarea id="anotacao" name="anotacao" placeholder="Anotação" />
            </div>
          </form>
        </div>

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-1/2"
              type="button"
              variant="secondary"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            form="transaction-form"
            className="w-full sm:w-1/2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
