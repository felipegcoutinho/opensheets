"use client";
import { createCategory } from "@/app/actions/categories/create_categories";
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
import { categoryIconOptions } from "@/hooks/use-category-icons";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResponse } from "./form-schema";

const initialState: ActionResponse = { success: false, message: "" };

export default function CreateCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(
    createCategory,
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
          Nova Categoria
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Categoria</Label>
            <Input id="nome" name="nome" placeholder="Digite o nome" required />
          </div>

          <div>
            <Label htmlFor="tipo_categoria">Tipo de Categoria</Label>
            <Select name="tipo_categoria" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo da categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="icone">Ícone</Label>
            <Select name="icone" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o ícone" />
              </SelectTrigger>
              <SelectContent>
                <div className="grid grid-cols-5 p-1">
                  {categoryIconOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="hover:border-primary hover:bg-accent focus:border-primary focus:bg-accent data-[state=checked]:border-primary data-[state=checked]:bg-accent flex cursor-pointer items-center justify-center rounded-md border-2 border-transparent p-2 transition-all"
                    >
                      <opt.icon className="h-8 w-8" />
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
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
