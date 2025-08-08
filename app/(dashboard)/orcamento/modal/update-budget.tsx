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
import { updateBudget } from "@/app/actions/orcamentos/update_budget";
import type { ActionResponse } from "./form-schema";

type Props = {
  item: any;
  categorias: any[];
};

const initialState: ActionResponse = { success: false, message: "" };

export default function UpdateBudget({ item, categorias }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateBudget, initialState);

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
      <DialogTrigger>editar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Orçamento</DialogTitle>
        </DialogHeader>
                <form action={action} className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === " " && e.target instanceof HTMLInputElement) {
              e.stopPropagation();
            }
          }}
        >
          <input type="hidden" name="id" value={item.id} />

          <div className="w-full">
            <Label>Categoria</Label>
            <Select
              defaultValue={item.categorias?.id.toString()}
              name="categoria_id"
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((item) => {
                  const Icon = categoryIconsMap[item.icone];
                  return (
                    <SelectItem
                      className="capitalize"
                      key={item.id}
                      value={item.id.toString()}
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.nome}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Período</Label>
            <Select name="periodo" defaultValue={item.periodo}>
              <SelectTrigger className="w-full">
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
              defaultValue={item.valor_orcado}
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
              {isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
