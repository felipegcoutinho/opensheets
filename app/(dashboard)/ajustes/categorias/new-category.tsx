"use client";

import { addCategories } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

export default function AddCategoriaForm() {
  const [state, formAction] = useActionState(addCategories, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="mt-2 mb-4 transition-all hover:scale-110"
        >
          Nova Categoria
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-6">
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
                <SelectItem value="receita">receita</SelectItem>
                <SelectItem value="despesa">despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="icone">Ícone (opcional)</Label>
            <Input
              id="icone"
              name="icone"
              placeholder="Ex: home, user, etc."
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Adicionar Categoria
          </Button>

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
