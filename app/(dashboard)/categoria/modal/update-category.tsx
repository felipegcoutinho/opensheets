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
import { updateCategory } from "@/app/actions/categories/update_categories";

type Props = {
  itemId: number;
  itemNome: string;
  itemTipoCategoria: string;
  itemUsadoParaCalculos: boolean;
};

export default function UpdateCategory({
  itemId,
  itemNome,
  itemTipoCategoria,
  itemUsadoParaCalculos,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateCategory, {
    success: false,
    message: "",
  });

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
          <DialogTitle>Atualizar Categoria</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={itemId} />

          <div>
            <Label htmlFor="nome">Nome da Categoria</Label>
            <Input
              id="nome"
              name="nome"
              required
              placeholder="Digite o nome"
              type="text"
              defaultValue={itemNome}
            />
          </div>

          <div>
            <Label htmlFor="tipo_categoria">Tipo de Categoria</Label>
            <Select
              name="tipo_categoria"
              defaultValue={itemTipoCategoria}
              type="text"
              id="tipo_categoria"
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <Card className="p-4">
            <div className="items-top flex space-x-2">
              <Toggle
                onPressedChange={() =>
                  setIsUsedForCalculations(!itemUsadoParaCalculos)
                }
                defaultPressed={itemUsadoParaCalculos}
                name="usado_para_calculos"
                id="isUsedForCalculations"
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
              {isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
