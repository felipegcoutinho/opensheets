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
import { UseDates } from "@/hooks/use-dates";
import Image from "next/image";
import Utils from "../utils";

export default function CreateBills({ getAccountMap, getCategorias }) {
  const {
    loading,
    categoriasDespesa,
    handleSubmit,
    setStatusPagamento,
    showRecorrencia,
    handleCondicaoChange,
    isDividedChecked,
    setIsDividedChecked,
    isOpen,
    setIsOpen,
  } = Utils();

  const { getMonthOptions } = UseDates();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="transition-all hover:scale-110">Novo Boleto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Boleto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-1 flex w-full gap-2">
            <div className="w-1/2">
              <Label>
                Descrição
                <Required />
              </Label>
              <Input name="descricao" placeholder="Descrição" type="text" />
            </div>

            <div className="w-1/2">
              <Label>
                Período
                <Required />
              </Label>
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
              <Label>
                Data de Vencimento
                <Required />
              </Label>
              <Input name="dt_vencimento" type="date" />
            </div>

            {/* Novo formulario  */}
            <div className="w-1/2">
              <Label>
                Categoria
                <Required />
              </Label>

              <Select name="categoria_id">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getCategorias
                    ?.filter(
                      (categoria) => categoria.tipo_categoria === "despesa",
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

          <div className="mb-1 flex w-full gap-2">
            <div className="w-full">
              <Label>
                Valor
                <Required />
              </Label>
              <MoneyInput name="valor" placeholder="R$ 0,00" />
            </div>
          </div>

          <Card className="mt-2 flex items-center justify-between rounded p-2">
            <Label>Dividir Boleto</Label>
            <Switch
              name="dividir_boleto"
              checked={isDividedChecked}
              onCheckedChange={() => setIsDividedChecked(!isDividedChecked)}
            />
          </Card>

          <div className="flex w-full gap-2">
            <div className="w-full">
              <Label>
                Responsável
                <Required />
              </Label>
              <Input
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

          <div className="flex w-full gap-2">
            <div className={showRecorrencia ? "w-1/2" : "w-full"}>
              <Label>
                Condição
                <Required />
              </Label>

              <Select
                name="condicao"
                onValueChange={handleCondicaoChange}
                defaultValue="vista"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vista">À Vista</SelectItem>
                  <SelectItem value="recorrente">Recorrente</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

          <div className="mb-1 flex w-full gap-2">
            <div className="w-full">
              <Label>
                Status de Pagamento
                <Required />
              </Label>

              <Select
                name="status_pagamento"
                onValueChange={(e) => setStatusPagamento(e)}
                defaultValue="pendente"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <Label>
              Conta Padrão
              <Required />
            </Label>

            <Select name="conta_id">
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
              <Textarea name="anotacao" placeholder="Anotação" />
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
