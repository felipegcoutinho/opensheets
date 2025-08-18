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

interface UpdatePayerProps {
  item: {
    id: string;
    nome: string;
    email: string;
    status: string;
    role?: string;
    anotacao?: string;
    foto?: string | null;
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
            <Label htmlFor="foto">Foto (Avatar)</Label>
            <div className="mb-2 flex items-center gap-3">
              {selectedAvatar ? (
                <img
                  src={`/avatars/${selectedAvatar}`}
                  alt="Pré-visualização do avatar selecionado"
                  width={56}
                  height={56}
                  className="size-14 rounded-full border"
                />
              ) : (
                <div className="text-muted-foreground size-14 rounded-full border bg-muted/30 flex items-center justify-center text-xs">
                  Sem avatar
                </div>
              )}
            </div>
            <Select
              name="foto"
              defaultValue={item.foto || "__none__"}
              onValueChange={(v) => setSelectedAvatar(v === "__none__" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um avatar" />
              </SelectTrigger>
              <SelectContent>
                <div className="grid grid-cols-3 gap-2 p-2">
                  <SelectItem value="__none__" className="p-1">
                    <span className="flex items-center gap-2">
                      <div className="size-8 rounded-full border bg-muted/30" />
                      <span className="text-xs">Sem avatar</span>
                    </span>
                  </SelectItem>
                  {avatars.map((file) => (
                    <SelectItem key={file} value={file} className="p-1">
                      <span className="flex items-center gap-2">
                        <img
                          src={`/avatars/${file}`}
                          alt={file}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-xs">{file.replace(/\..+$/, "")}</span>
                      </span>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={item.status} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo" disabled={item.role === "principal"}>
                  Inativo
                </SelectItem>
              </SelectContent>
            </Select>
            {item.role === "principal" && (
              <p className="text-muted-foreground mt-1 text-xs">
                O pagador principal não pode ser inativado.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="anotacao">Anotação</Label>
            <Textarea
              id="anotacao"
              name="anotacao"
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
