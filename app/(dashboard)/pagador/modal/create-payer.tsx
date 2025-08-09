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

export default function CreatePayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(
    createPayer,
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
