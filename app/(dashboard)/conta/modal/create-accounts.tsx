"use client";
import { createAccount } from "@/app/actions/accounts/create_accounts";
import PaymentMethodLogo from "@/components/payment-method-logo";
import Ping from "@/components/ping-icon";
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
import { Input } from "@/components/ui/input";
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
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function CreateAccount() {
  const { logos } = UseOptions();
  const [isOpen, setIsOpen] = useState(false);
  const [isIgnored, setIsIgnored] = useState(false);
  const [state, action, isPending] = useActionState(
    createAccount,
    initialState,
  );

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
          Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-2">
          <input type="hidden" name="is_ignored" value={String(isIgnored)} />
          <div className="w-full">
            <Label>
              Escolha o Logo
              <Required />
            </Label>
            <Select name="logo_image" required>
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Selecione a imagem para a conta" />
              </SelectTrigger>
              <SelectContent>
                {logos.map((item) => (
                  <SelectItem key={item.name} value={item.file}>
                    <PaymentMethodLogo
                      url_name={`/logos/${item.file}`}
                      descricao={item.name}
                      width={32}
                      height={32}
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
          <div className="w-full">
            <Label>
              Tipo da Conta
              <Required />
            </Label>
            <Select name="tipo_conta" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Corrente</SelectItem>
                <SelectItem value="poupança">Poupança</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Label>
              Status da Conta
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
          {/* <div className="flex items-center justify-between rounded-md border p-4">
            <Label className="text-sm">
              Desconsiderar essa conta nos cálculos mensais
            </Label>
            <Switch checked={isIgnored} onCheckedChange={setIsIgnored} />
          </div> */}
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
