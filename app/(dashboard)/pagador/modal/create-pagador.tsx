"use client";

import Required from "@/components/required-on-forms";
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
import UseOptions from "@/hooks/use-options";
import Image from "next/image";
import UtilitiesPagador from "../utilities-pagador";

export default function CreatePagador() {
  const { isOpen, setIsOpen, handleSubmit, loading } = UtilitiesPagador();

  const { logos } = UseOptions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4 transition-all hover:scale-110">
          Novo Pagador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Pagador</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-2">
          {/* Foto */}
          <div className="w-full">
            <Label>
              Escolha a Foto
              <Required />
            </Label>
            <Select name="foto" required>
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Selecione a imagem para o cartão" />
              </SelectTrigger>
              <SelectContent>
                {logos.map((item) => (
                  <SelectItem key={item.name} value={item.file}>
                    <div className="flex items-center gap-2">
                      <Image
                        quality={100}
                        src={`/logos/${item.file}`}
                        className="h-8 w-8 rounded-full border"
                        width={32}
                        height={32}
                        alt="Logo do cartão"
                      />
                      <span>{item.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nome */}
          <div className="w-full">
            <Label htmlFor="nome">
              Nome
              <Required />
            </Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome completo do pagador"
              type="text"
              required
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="email@exemplo.com"
              type="email"
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">
              Status do Pagador
              <Required />
            </Label>
            <Select name="status" defaultValue="ativo" required>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">
              Função do Pagador
              <Required />
            </Label>
            <Select name="role" defaultValue="principal" required>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="secundario">Secundário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Anotação */}
          <div className="w-full">
            <Label>Anotação</Label>
            <Textarea name="anotacao" placeholder="Anotação" />
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
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
