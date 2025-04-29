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
import CategoryHelper from "../category-helper";

export default function UpdateCategory({
  itemId,
  itemNome,
  itemTipoCategoria,
}) {
  const { handleUpdate, updateLoading, isOpen, setIsOpen } = CategoryHelper();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>Editar</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Categoria</DialogTitle>
        </DialogHeader>

        <form action={handleUpdate} className="space-y-4">
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
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose asChild>
              <Button className="w-1/2" type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>

            <Button className="w-1/2" type="submit" disabled={updateLoading}>
              {updateLoading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
