"use client";
import { createPayer } from "@/app/actions/pagadores/create_pagadores";
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

const initialState: ActionResponse = { success: false, message: "" };

export default function CreatePayer({ avatars = [] as string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createPayer, initialState);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

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
        <Button className="mb-4 transition-all hover:scale-110">
          Novo Pagador
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Pagador</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" placeholder="Digite o nome" required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o email"
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
            <Select name="status" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="anotacao">Anotação</Label>
            <Textarea
              id="anotacao"
              name="anotacao"
              placeholder="Digite a anotação"
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
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
