"use client";

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
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createCategory } from "@/app/actions/categories/create_categories";
import type { ActionResponse } from "./form-schema";
import { categoryIconOptions } from "@/utils/category-icons";

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

      <DialogContent>
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
              <SelectContent className="w-60">
                <div className="grid grid-cols-5 gap-2 p-1">
                  {categoryIconOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="flex h-12 flex-col items-center justify-center gap-1 capitalize"
                    >
                      <opt.icon className="h-5 w-5" />
                      {opt.label}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* <Card className="p-4">
            <div className="items-top flex space-x-2">
              <Toggle
                onPressedChange={() =>
                  setIsUsedForCalculations(!isUsedForCalculations)
                }
                id="isUsedForCalculations"
                // defaultPressed={true}
                pressed={isUsedForCalculations}
                name="usado_para_calculos"
                className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-400"
              >
                <CheckCircleIcon strokeWidth={2} className="h-6 w-6" />
              </Toggle>

              <div className="grid gap-1.5 leading-none">
                <Label
                  className="text-foreground"
                  htmlFor="isUsedForCalculations"
                >
                  Considerar nos cálculos
                </Label>
                <p className="text-muted-foreground text-sm">
                  Se você desmarcar essa opção, essa categoria NÃO será
                  considerada nos cálculos de receitas e despesas.
                </p>
              </div>
            </div>
          </Card> */}

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
