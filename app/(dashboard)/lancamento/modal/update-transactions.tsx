"use client";
import PaymentMethodLogo from "@/components/payment-method-logo";
import Required from "@/components/required-on-forms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { categoryIconsMap } from "@/hooks/use-category-icons";
import { UseDates } from "@/hooks/use-dates";
import { RiThumbUpLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
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
  // Opções via React Query
  const {
    data: descData,
    isLoading: isLoadingDesc,
    error: descError,
  } = useQuery({
    queryKey: ["descriptions", selectedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/descriptions?month=${selectedMonth}`);
      if (!res.ok) throw new Error("Falha ao carregar descrições");
      return res.json();
    },
    staleTime: 60_000,
  });

  const {
    data: payersData,
    isLoading: isLoadingPayers,
    error: payersError,
  } = useQuery({
    queryKey: ["payers"],
    queryFn: async () => {
      const res = await fetch(`/api/pagadores`);
      if (!res.ok) throw new Error("Falha ao carregar pagadores");
      return res.json();
    },
    staleTime: 60_000,
  });

  const descricaoOptions: string[] = descData?.data || [];
  const payersOptions: {
    nome: string;
    role?: string | null;
    foto?: string | null;
  }[] = payersData?.data || [];

  const resolveFotoSrc = (foto?: string | null) => {
    if (!foto) return undefined;
    if (foto.startsWith("http")) return foto;
    if (foto.startsWith("/")) return foto;
    return `/avatars/${foto}`;
  };

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
      <DialogTrigger className="cursor-pointer">editar</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Atualizar lançamento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleUpdate}
          className="space-y-2"
          onKeyDown={(e) => {
            if (
              e.key === " " &&
              (e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement)
            ) {
              e.stopPropagation();
            }
          }}
        >
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
                  .map((item) => {
                    const Icon = categoryIconsMap[item.icone];
                    return (
                      <SelectItem
                        className="capitalize"
                        key={item.id}
                        value={item.id.toString()}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && <Icon className="h-4 w-4" />}
                          {item.nome}
                        </span>
                      </SelectItem>
                    );
                  })}
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
                  className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-400"
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
                <SelectTrigger id="conta_id" className="w-full py-6">
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
                <SelectTrigger id="cartao_id" className="w-full py-6">
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
              Pagador
              <Required />
            </Label>
            <Select name="pagador_id" defaultValue={itemResponsavel}>
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {payersOptions.map((p) => (
                  <SelectItem
                    key={p.nome}
                    value={p.nome}
                    className="capitalize"
                  >
                    <span className="flex items-center gap-2">
                      <Avatar className="size-8">
                        {resolveFotoSrc(p.foto) ? (
                          <AvatarImage
                            src={resolveFotoSrc(p.foto)}
                            alt={p.nome}
                          />
                        ) : null}
                        <AvatarFallback>
                          {(p?.nome?.[0] || "P").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {p.nome}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
