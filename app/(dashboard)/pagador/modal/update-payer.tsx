"use client";
import { updatePayer } from "@/app/actions/pagadores/update_pagadores";
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
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResponse } from "./form-schema";
import Ping from "@/components/ping-icon";

interface UpdatePayerProps {
  item: {
    id: string;
    nome: string;
    email: string;
    status: string;
    role?: string;
    anotacao?: string;
    foto?: string | null;
    is_auto_send?: boolean | null;
  };
  avatars?: string[];
}

const initialState: ActionResponse = { success: false, message: "" };

export default function UpdatePayer({ item, avatars = [] }: UpdatePayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(updatePayer, initialState);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(item.foto || "");

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
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pagador</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" defaultValue={item.nome} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o email"
              defaultValue={item.email}
            />
          </div>

          <div>
            <Label htmlFor="foto">Avatar</Label>

            <input
              type="hidden"
              name="foto"
              value={selectedAvatar || "__none__"}
            />
            <div className="grid grid-cols-6 gap-3">
              <button
                type="button"
                aria-pressed={!selectedAvatar}
                onClick={() => setSelectedAvatar("")}
                className={`rounded-full border ${!selectedAvatar ? "ring-primary ring-2" : ""}`}
                title="Sem avatar"
              >
                <div className="bg-muted/30 flex size-16 items-center justify-center rounded-full text-xs">
                  Sem avatar
                </div>
              </button>
              {avatars.map((file) => (
                <button
                  key={file}
                  type="button"
                  aria-pressed={selectedAvatar === file}
                  onClick={() => setSelectedAvatar(file)}
                  className={`rounded-full border ${selectedAvatar === file ? "ring-primary ring-2" : ""}`}
                  title="Selecionar avatar"
                >
                  <img
                    src={`/avatars/${file}`}
                    alt=""
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div hidden={item.role === "principal"}>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={item.status} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">
                  <div className="flex items-center gap-2">
                    <Ping color="bg-emerald-500" /> Ativo
                  </div>
                </SelectItem>
                <SelectItem value="inativo">
                  <div className="flex items-center gap-2">
                    <Ping color="bg-zinc-400" /> Inativo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {item.role === "principal" && (
              <p className="text-muted-foreground mt-1 text-xs">
                O pagador principal não pode ser inativado.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              id="is_auto_send"
              name="is_auto_send"
              type="checkbox"
              defaultChecked={Boolean(item.is_auto_send)}
            />
            <Label htmlFor="is_auto_send">
              Enviar e-mails automaticamente ao criar lançamentos
            </Label>
          </div>

          <div>
            <Label htmlFor="anotacao">Anotação</Label>
            <Textarea
              id="anotacao"
              name="anotacao"
              placeholder="Digite a anotação"
              defaultValue={item.anotacao || ""}
            />
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
              {isPending ? "Atualizando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
