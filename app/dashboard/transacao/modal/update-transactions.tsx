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
import { ImageOff, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import Utils from "../utils";

export default function UpdateTransactions({
  itemId,
  itemCategoria,
  itemDescricao,
  itemNotas,
  itemDate,
  itemResponsavel,
  itemTipoTransacao,
  itemValor,
  itemPeriodo,
  itemPaid,
  itemImagemURL,
}) {
  const {
    categoriasReceita,
    categoriasDespesa,
    isOpen,
    setIsOpen,
    getMonthOptions,
    handleUpdate,
    setIsPaid,
    setImage,
    removingImage,
    handleRemoveImage,
  } = Utils();

  const [imagePreview, setImagePreview] = useState(itemImagemURL);

  useEffect(() => {
    setIsPaid(itemPaid);
  }, [itemPaid, setIsPaid]);

  const handleDialogClose = (val) => {
    setIsOpen(val);
    if (!val) {
      setImagePreview(itemImagemURL);
      setIsPaid(itemPaid);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageTeste = async () => {
    try {
      await handleRemoveImage(itemId, itemImagemURL);
      setImagePreview(null);
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger>Editar</DialogTrigger>
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
              <Select
                defaultValue={itemPeriodo}
                name="periodo"
                disabled={itemPaid}
              >
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
                disabled={itemPaid}
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
              Marcar lançamento como Pago
            </Label>
            <Toggle
              onPressedChange={() => setIsPaid(!itemPaid)}
              defaultPressed={itemPaid}
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

          <div>
            <Label>Comprovantes</Label>
            <Input
              className="border-dotted border-neutral-400"
              name="imagem_url"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="group relative">
              {imagePreview ? (
                <div
                  className="relative mt-2 h-16 w-full cursor-pointer overflow-hidden rounded"
                  onClick={handleRemoveImageTeste}
                  disabled={removingImage}
                >
                  <img
                    src={imagePreview}
                    alt="Comprovante"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-semibold text-white">
                      {removingImage ? "Removendo..." : "Remover Imagem"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex h-10 items-center justify-center bg-neutral-200 text-muted-foreground">
                  <p>Não há anexos para essa transação</p>
                  <ImageOff className="ml-2" size={16} />
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full">
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

            <Button className="w-1/2" type="submit">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
