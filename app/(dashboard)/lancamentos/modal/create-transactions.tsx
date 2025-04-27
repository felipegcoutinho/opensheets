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
import Utils from "../utils-transacao";

export default function CreateTransactions({
  getCards,
  getAccount,
  getCategorias,
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
    categoriasReceita,
    categoriasDespesa,
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
  } = Utils();

  const { getMonthOptions } = UseDates();

  if (showCartao && isPaid) {
    setIsPaid(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="default" className="transition-all hover:scale-110">
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        <div className="-mx-6 max-h-[500px] overflow-y-auto px-6">
          <form onSubmit={handleSubmit} id="transaction-form">
            <div className="mb-1 flex w-full gap-2">
              <div className="w-1/2">
                <Label>Data da Transação</Label>
                <Required />
                <Input name="data_compra" type="date" required />
              </div>

              <div className="w-1/2">
                <Label>Período</Label>
                <Required />
                <Select name="periodo" required>
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
                  name="descricao"
                  placeholder="Descrição"
                  type="text"
                  required
                />
              </div>

              <div className="w-1/2">
                <Label>Valor</Label>
                <Required />
                <MoneyInput name="valor" placeholder="R$ 0,00" required />
              </div>
            </div>

            <div className="mt-1 flex w-full gap-2">
              <div className="w-1/2">
                <Label>Tipo de Transação</Label>
                <Select
                  required
                  name="tipo_transacao"
                  onValueChange={handleTipoTransacaoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">receita</SelectItem>
                    <SelectItem value="despesa">despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <Label>Categoria</Label>
                <Required />

                <Select name="categoria_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategorias?.map((item) => {
                      const IconComponent = item.icone;
                      return (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          <p>{item.nome}</p>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="w-1/2">
                <Label>Categoria</Label>
                <Select name="categoria" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <>
                      {tipoTransacao === "receita"
                        ? categoriasReceita.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <SelectItem
                                key={item.id}
                                value={item.name}
                                className="flex items-center gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4 text-green-500 dark:text-green-500" />
                                  {item.name}
                                </div>
                              </SelectItem>
                            );
                          })
                        : categoriasDespesa.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <SelectItem
                                key={item.id}
                                value={item.name}
                                className="flex items-center gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4 text-red-500 dark:text-red-500" />
                                  {item.name}
                                </div>
                              </SelectItem>
                            );
                          })}
                    </>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <Card className="mt-2 flex w-full items-center gap-2">
              <div
                className={`flex items-center justify-between gap-2 p-2 ${showCartao ? "w-full" : "w-1/2"}`}
              >
                <Label className="text-muted-foreground text-sm font-medium">
                  Dividir Lançamento
                </Label>
                <Switch
                  name="dividir_lancamento"
                  checked={isDividedChecked}
                  onCheckedChange={() => setIsDividedChecked(!isDividedChecked)}
                />
              </div>

              {!showCartao && (
                <div className="flex w-1/2 items-center justify-between gap-2 px-2">
                  <Label className="text-muted-foreground text-sm font-medium">
                    Status do Lançamento
                  </Label>

                  <Toggle
                    disabled={showCartao}
                    onPressedChange={() => setIsPaid(!isPaid)}
                    defaultPressed={true}
                    pressed={isPaid}
                    name="realizado"
                    className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-400"
                  >
                    <ThumbsUp strokeWidth={2} className="h-6 w-6" />
                  </Toggle>
                </div>
              )}
            </Card>

            <div className="flex w-full gap-2">
              <div className="w-full">
                <Label>Responsável</Label>
                <Required />
                <Input
                  required
                  list="responsavel-list"
                  name="responsavel"
                  placeholder="Responsável"
                  type="text"
                />
                <datalist id="responsavel-list">
                  <option value="você" />
                </datalist>
              </div>

              {isDividedChecked && (
                <div className="w-full">
                  <Label>Segundo Responsável</Label>
                  <Input
                    name="segundo_responsavel"
                    placeholder="Segundo Responsável"
                    type="text"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <div className={showConta || showCartao ? "w-1/2" : "w-full"}>
                <Label>Forma de Pagamento</Label>
                <Required />
                <Select
                  required
                  name="forma_pagamento"
                  onValueChange={(value) => handleFormaPagamentoChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pix">Pix</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Cartão de Débito">
                      Cartão de Débito
                    </SelectItem>
                    <SelectItem value="Cartão de Crédito">
                      Cartão de Crédito
                    </SelectItem>
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
                      {getAccount.map((item) => (
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
                  <Label>Cartão</Label>
                  <Required />
                  <Select name="cartao_id">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCards.map((item) => (
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

            <div className="flex w-full gap-2">
              <div
                className={showParcelas || showRecorrencia ? "w-1/2" : "w-full"}
              >
                <Label>Condição</Label>
                <Select
                  name="condicao"
                  onValueChange={handleCondicaoChange}
                  defaultValue="vista"
                  required
                >
                  <SelectTrigger>
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
                  <Label>Parcelado em</Label>
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
                  <Label>Lançamento fixo</Label>
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

            <div className="w-full">
              <Label>Anexo</Label>
              <Input
                className="border-dotted border-neutral-400"
                type="file"
                name="imagem_url"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="mb-1 flex w-full gap-2">
              <div className="w-full">
                <Label>Anotação</Label>
                <Textarea name="anotacao" placeholder="Anotação" />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <DialogClose asChild>
            <Button className="w-1/2" type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            form="transaction-form"
            className="w-1/2"
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
