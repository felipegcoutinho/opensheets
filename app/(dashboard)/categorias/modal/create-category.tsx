"use client";

import { addCategories } from "@/app/actions/categories";
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
import { useActionState } from "react";

const initialState = {
  message: "",
};

export default function CreateCategory() {
  const [state, formAction, loading] = useActionState(
    addCategories,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="mb-4 transition-all hover:scale-110"
        >
          Nova Categoria
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Categoria</Label>
            <Input id="nome" name="nome" required placeholder="Digite o nome" />
          </div>

          <div>
            <Label htmlFor="tipo_categoria">Tipo de Categoria</Label>
            <Select name="tipo_categoria" required>
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
            <Button className="w-1/2" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>

          {state.message && (
            <p className="mt-2 text-center text-sm text-red-500">
              {state.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
