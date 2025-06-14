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
import UseOptions from "@/hooks/use-options";
import Image from "next/image";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useState } from "react";
import {
  cardFormSchema,
  type CardFormSchema,
  type ActionResponse,
} from "./form-schema";
import { addCards } from "@/actions/cards";
import { toast } from "sonner";

export default function CreateCard({ getAccountMap }) {
  const { logos, bandeiras } = UseOptions();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CardFormSchema>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { status: "ativo" } as Partial<CardFormSchema>,
  });

  const initialState: ActionResponse = { success: false, message: "" };
  const [state, action, isPending] = useActionState(addCards, initialState);

  const onSubmit = async (values: CardFormSchema) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });
    const result = await action(formData);
    if (result.success) {
      toast.success(result.message);
      setIsOpen(false);
      form.reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4 transition-all hover:scale-110">
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="w-full">
            <Label>
              Escolha o Logo
              <Required />
            </Label>
            <Select
              onValueChange={(val) => form.setValue("logo_image", val)}
              value={form.watch("logo_image")}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a imagem para o cartão" />
              </SelectTrigger>
              <SelectContent>
                {logos.map((item) => (
                  <SelectItem key={item.name} value={item.file}>
                    <PaymentMethodLogo
                      url_name={`/logos/${item.file}`}
                      descricao={item.name}
                      width={34}
                      height={34}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>
              Descrição
              <Required />
            </Label>
            <Input
              placeholder="Descrição"
              type="text"
              {...form.register("descricao")}
            />
          </div>

          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>
                Data de Fechamento
                <Required />
              </Label>
              <Input
                min={1}
                max={31}
                placeholder="Data de Fechamento"
                type="number"
                {...form.register("dt_fechamento", { valueAsNumber: true })}
              />
            </div>

            <div className="w-1/2">
              <Label>
                Data de Vencimento
                <Required />
              </Label>
              <Input
                min={1}
                max={31}
                placeholder="Data de Vencimento"
                type="number"
                {...form.register("dt_vencimento", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>
                Bandeira
                <Required />
              </Label>
              <Select
                onValueChange={(val) => form.setValue("bandeira", val)}
                value={form.watch("bandeira")}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {bandeiras.map((item) => (
                    <SelectItem key={item.name} value={item.file}>
                      <div className="flex items-center gap-2">
                        <Image
                          quality={100}
                          src={`/bandeiras/${item.file}`}
                          className="rounded-full"
                          width={32}
                          height={32}
                          alt="Logo do cartão"
                        />
                        <span>{item.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/2">
              <Label>
                Tipo do Cartão
                <Required />
              </Label>
              <Select
                onValueChange={(val) => form.setValue("tipo", val)}
                value={form.watch("tipo")}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="físico">Físico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>
              Status do Cartão
              <Required />
            </Label>
            <Select
              onValueChange={(val) => form.setValue("status", val)}
              value={form.watch("status")}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>
              Limite
              <Required />
            </Label>
            <MoneyInput placeholder="R$ 0,00" {...form.register("limite")} />
          </div>

          <div className="w-full">
            <Label>
              Conta Padrão
              <Required />
            </Label>
            <Select
              onValueChange={(val) => form.setValue("conta_id", val)}
              value={form.watch("conta_id")}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {getAccountMap?.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    <PaymentMethodLogo
                      url_name={`/logos/${item.logo_image}`}
                      descricao={item.descricao}
                      width={34}
                      height={34}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>Anotação</Label>
            <Textarea placeholder="Anotação" {...form.register("anotacao")} />
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
              disabled={isPending}
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
