"use client";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
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
import { UseDates } from "@/hooks/use-dates";
import Image from "next/image";
import Utils from "../utils";

export default function UpdateBills({
  itemId,
  itemDescricao,
  itemPeriodo,
  itemDtVencimento,
  itemCategoria,
  itemValor,
  itemResponsavel,
  itemStatusPagamento,
  itemDtPagamento,
  itemAnotacao,
  itemCondicao,
  itemQtdeRecorrencia,
  itemContaId,
  getAccountMap,
}) {
  const {
    loading,
    categoriasDespesa,
    handleUpdate,
    setStatusPagamento,
    handleCondicaoChange,
    isOpen,
    setIsOpen,
  } = Utils();

  const { getMonthOptions } = UseDates();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>Editar</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Boleto</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <input type="hidden" name="id" value={itemId} />

            <div className="mb-1 flex w-full gap-2">
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
                <Label>Data de Vencimento</Label>
                <Required />
                <Input
                  defaultValue={itemDtVencimento}
                  name="dt_vencimento"
                  type="date"
                />
              </div>

              <div className="w-1/2">
                <Label>Categoria</Label>
                <Required />
                <Select defaultValue={itemCategoria} name="categoria">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasDespesa.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <SelectItem
                          key={item.id}
                          value={item.name}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-red-500" />
                            {item.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-1 flex w-full gap-2">
              <div className="w-full">
                <Label>Valor</Label>
                <Required />
                <MoneyInput
                  readOnly={itemStatusPagamento === "Pago"}
                  defaultValue={itemValor}
                  name="valor"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="mb-1 flex w-full gap-2">
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
            </div>

            <div
              className={`${itemCondicao === "Recorrente" && "flex gap-2"} hidden w-full`}
            >
              <div
                className={`${itemCondicao === "Recorrente" ? "w-1/2" : "w-full"}`}
              >
                <Label>Condição</Label>
                <Required />
                <Select
                  defaultValue={itemCondicao}
                  name="condicao"
                  onValueChange={handleCondicaoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vista">À Vista</SelectItem>
                    <SelectItem value="Recorrente">Recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {itemCondicao === "Recorrente" && (
                <div className="w-1/2">
                  <Label>Quant. recorrencia</Label>
                  <Select
                    defaultValue={itemQtdeRecorrencia}
                    name="qtde_recorrencia"
                  >
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

            <div className="mb-1 flex w-full gap-2">
              <div className="w-full">
                <Label>Status de Pagamento</Label>
                <Required />
                <Select
                  defaultValue={itemStatusPagamento}
                  name="status_pagamento"
                  onValueChange={(e) => setStatusPagamento(e)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full">
              <Label>Conta Padrão</Label>
              <Required />
              <Select defaultValue={itemContaId.toString()} name="conta_id">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getAccountMap?.map((item) => (
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

            <div className="mb-1 flex w-full gap-2">
              <div className="w-full">
                <Label>Anotação</Label>
                <Textarea
                  defaultValue={itemAnotacao}
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
                {loading ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
