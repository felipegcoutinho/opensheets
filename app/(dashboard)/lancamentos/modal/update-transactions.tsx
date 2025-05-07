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
import { UseDates } from "@/hooks/use-dates";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import Utils from "../utils-transacao";

export default function UpdateTransactions({
  itemId,
  itemDescricao,
  itemNotas,
  itemDate,
  itemResponsavel,
  itemTipoTransacao,
  itemValor,
  itemPeriodo,
  itemPaid,
  itemImagemURL,
  itemCategoriaId,
  getCategorias,
}) {
  const {
    isOpen,
    setIsOpen,
    handleUpdate,
    setIsPaid,
    setImage,
    removingImage,
    handleRemoveImage,
    loading,
  } = Utils();

  const [imagePreview, setImagePreview] = useState(itemImagemURL);

  const { getMonthOptions } = UseDates();

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
              <Label>
                Data da Transação
                <Required />
              </Label>
              <Input defaultValue={itemDate} name="data_compra" type="date" />
            </div>

            <div className="w-1/2">
              <Label>
                Período
                <Required />
              </Label>
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
              <Label>
                Descrição
                <Required />
              </Label>
              <Input
                defaultValue={itemDescricao}
                name="descricao"
                placeholder="Descrição"
                type="text"
              />
            </div>

            <div className="w-1/2">
              <Label>
                Valor
                <Required />
              </Label>
              <MoneyInput defaultValue={itemValor} name="valor" />
            </div>
          </div>

          <div className="w-full">
            <Label>
              Categoria
              <Required />
            </Label>
            <Select
              defaultValue={itemCategoriaId.toString()}
              name="categoria_id"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {getCategorias
                  ?.filter(
                    (categoria) =>
                      categoria.tipo_categoria === itemTipoTransacao,
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

          <Card className="mt-2 flex w-full items-center justify-between gap-2 px-2">
            <Label>Marcar lançamento como Pago</Label>

            <Toggle
              onPressedChange={() => setIsPaid(!itemPaid)}
              defaultPressed={itemPaid}
              name="realizado"
              className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-400"
            >
              <ThumbsUp strokeWidth={2} className="h-6 w-6" />
            </Toggle>
          </Card>

          <div className="w-full">
            <Label>
              Responsável
              <Required />
            </Label>
            <Input
              defaultValue={itemResponsavel}
              name="responsavel"
              placeholder="Responsável"
              type="text"
            />
          </div>

          <div>
            <Label>Anexo</Label>
            <Input
              className="border-dotted border-neutral-400"
              name="imagem_url"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="relative">
              {imagePreview && (
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

                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-semibold text-white">
                      {removingImage ? "Removendo..." : "Remover Imagem"}
                    </span>
                  </div>
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

          <DialogFooter className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
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
              className="w-full sm:w-1/2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
