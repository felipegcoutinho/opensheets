"use client";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
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
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createCard } from "@/app/actions/cards/create_cards";
import type { ActionResponse } from "./form-schema";
import Ping from "@/components/ping-icon";

const initialState: ActionResponse = { success: false, message: "" };

export default function CreateCard({ getAccountMap }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logos, bandeiras } = UseOptions();
  const [state, action, isPending] = useActionState(createCard, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 mb-4 transition-all hover:scale-110">
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-2">
          <div className="w-full">
            <Label>
              Escolha o Logo
              <Required />
            </Label>
            <Select name="logo_image" required>
              <SelectTrigger className="w-full py-6">
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
              name="descricao"
              placeholder="Descrição"
              type="text"
              required
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
                name="dt_fechamento"
                placeholder="Data de Fechamento"
                type="number"
                required
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
                name="dt_vencimento"
                placeholder="Data de Vencimento"
                type="number"
                required
              />
            </div>
          </div>

          <div className="full">
            <Label>
              Bandeira
              <Required />
            </Label>
            <Select name="bandeira" required>
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

          <div>
            <Label>
              Status do Cartão
              <Required />
            </Label>
            <Select name="status" defaultValue="ativo" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">
                  <div className="flex items-center gap-2">
                    <Ping color="bg-green-500" /> Ativo
                  </div>
                </SelectItem>
                <SelectItem value="inativo">
                  <div className="flex items-center gap-2">
                    <Ping color="bg-zinc-400" /> Inativo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>
              Limite
              <Required />
            </Label>
            <MoneyInput name="limite" placeholder="R$ 0,00" />
          </div>

          <div className="w-full">
            <Label>
              Conta Padrão
              <Required />
            </Label>
            <Select name="conta_id" required>
              <SelectTrigger className="w-full py-6">
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
            <Textarea name="anotacao" placeholder="Anotação" />
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
