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
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UtilitiesOrcamento from "../utilities-orcamento";
import { useEffect } from "react";

type Props = {
  item: any;
  categorias: any[];
};

export default function UpdateBudget({ item, categorias }: Props) {
  const { handleUpdate, updateLoading, isOpen, setIsOpen } =
    UtilitiesOrcamento();

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>Editar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Orçamento</DialogTitle>
        </DialogHeader>
        <form action={handleUpdate} className="space-y-4">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              defaultValue={item.descricao}
              required
            />
          </div>
          <div>
            <Label htmlFor="valor_orcado">Valor Orçado</Label>
            <MoneyInput
              id="valor_orcado"
              name="valor_orcado"
              defaultValue={item.valor_orcado}
              placeholder="R$ 0,00"
            />
          </div>
          <div>
            <Label htmlFor="periodo">Período</Label>
            <Input id="periodo" name="periodo" defaultValue={item.periodo} />
          </div>
          <div>
            <Label htmlFor="categoria_id">Categoria</Label>
            <Select
              name="categoria_id"
              defaultValue={String(item.categoria_id)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.nome}
                  </SelectItem>
                ))}
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
              disabled={updateLoading}
            >
              {updateLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
