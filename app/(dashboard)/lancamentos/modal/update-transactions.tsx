"use client";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
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
import { RiThumbUpLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import UtilitiesLancamento from "../utilities-lancamento";

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
  itemFormaPagamento,
  itemCartaoId,
  itemContaId,
  getCards,
  getAccount,
  item,
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
  } = UtilitiesLancamento();

  const [imagePreview, setImagePreview] = useState(itemImagemURL);

  const { getMonthOptions } = UseDates();

  const [selectedMonth, setSelectedMonth] = useState(itemPeriodo);
  const [descricaoOptions, setDescricaoOptions] = useState<string[]>([]);
  const [responsavelOptions, setResponsavelOptions] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      const descRes = await fetch(`/api/descriptions?month=${selectedMonth}`);
      const descJson = await descRes.json();
      setDescricaoOptions(descJson.data || []);
      const respRes = await fetch(`/api/responsaveis?month=${selectedMonth}`);
      const respJson = await respRes.json();
      setResponsavelOptions(respJson.data || []);
    }
    if (selectedMonth) fetchOptions();
  }, [selectedMonth]);

  const secondResponsavelOptions = responsavelOptions.filter(
    (r) => r.toLowerCase() !== "você",
  );

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
      <DialogTrigger className="cursor-pointer">Editar</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Atualizar lançamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-2">
          <input type="hidden" name="id" value={item.id} />

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
                name="periodo"
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-full">
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
                defaultValue={item.descricao}
                name="descricao"
                placeholder="Descrição"
                type="text"
                list="descricao-update-list"
              />
              <datalist id="descricao-update-list">
                {descricaoOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
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
              <SelectTrigger className="w-full capitalize">
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

          {itemFormaPagamento !== "cartão de crédito" && (
            <Card className="w-full flex-row justify-between p-4">
              <div className="flex flex-col">
                <Label>Status do Lançamento</Label>
                <p className="text-muted-foreground text-xs leading-snug">
                  Marcar o lançamento como realizado.
                </p>
              </div>
              <div>
                <Toggle
                  defaultPressed={itemPaid}
                  onPressedChange={() => setIsPaid(!itemPaid)}
                  name="realizado"
                  className="hover:bg-transparent data-[state=on]:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:text-green-400"
                >
                  <RiThumbUpLine strokeWidth={2} />
                </Toggle>
              </div>
            </Card>
          )}

          {itemFormaPagamento !== "cartão de crédito" ? (
            <div className="w-full">
              <Label htmlFor="conta_id">
                Contas <Required />
              </Label>
              <Select
                name="conta_id"
                placeholder="Selecione"
                defaultValue={itemContaId.toString()}
                required
              >
                <SelectTrigger id="conta_id" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getAccount?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <PaymentMethodLogo
                        url_name={`/logos/${item.logo_image}`}
                        descricao={item.descricao}
                        width={32}
                        height={32}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="w-full">
              <Label htmlFor="cartao_id">
                Cartão <Required />
              </Label>
              <Select
                name="cartao_id"
                defaultValue={itemCartaoId.toString()}
                required
              >
                <SelectTrigger id="cartao_id" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getCards?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <PaymentMethodLogo
                        url_name={`/logos/${item.logo_image}`}
                        descricao={item.descricao}
                        width={32}
                        height={32}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              className="capitalize"
              list="responsavel-update-list"
            />
            <datalist id="responsavel-update-list">
              {responsavelOptions.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
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

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
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
