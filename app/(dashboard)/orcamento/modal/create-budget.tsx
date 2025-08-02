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
import { MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseDates } from "@/hooks/use-dates";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createBudget } from "@/app/actions/orcamentos/create_budget";
import type { ActionResponse } from "./form-schema";

type Props = {
  categorias: any[];
};

const initialState: ActionResponse = { success: false, message: "" };

export default function CreateBudget({ categorias }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createBudget, initialState);
  const { getMonthOptions, formatted_current_month } = UseDates();
  const month = formatted_current_month;

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
          Novo orçamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="categoria_id">Categoria</Label>
            <Select name="categoria_id" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => {
                  const Icon = categoryIconsMap[cat.icone];
                  return (
                    <SelectItem
                      key={cat.id}
                      value={String(cat.id)}
                      className="capitalize"
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        {cat.nome}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="periodo">Período</Label>
            <Select name="periodo" defaultValue={month} required>
              <SelectTrigger id="periodo" className="w-full">
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

          <div>
            <Label htmlFor="valor_orcado">Valor Limite</Label>
            <MoneyInput
              id="valor_orcado"
              name="valor_orcado"
              placeholder="R$ 0,00"
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
