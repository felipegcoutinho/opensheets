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
import { Input, MoneyInput } from "@/components/ui/input";
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
import Utils from "../utils";

export default function CreateCard({ getAccountMap }) {
  const {
    isOpen,
    setIsOpen,
    handleSubmit,
    loading,
    statusPagamento,
    setStatusPagamento,
  } = Utils();

  const { logos, bandeiras } = UseOptions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Novo Cartão</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <Label>Escolha o Logo</Label>
            <Required />
            <Select name="logo_image" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a imagem para o cartão" />
              </SelectTrigger>
              <SelectContent>
                {logos.map((item) => (
                  <SelectItem key={item.name} value={item.file}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/logos/${item.file}`}
                        className="h-8 w-8 rounded border"
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

          <div className="w-full">
            <Label>Descrição</Label>
            <Required />
            <Input
              name="descricao"
              placeholder="Descrição"
              type="text"
              required
            />
          </div>

          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>Data de Fechamento</Label>
              <Required />
              <Input
                min={1}
                max={31}
                name="dt_fechamento"
                placeholder="Data de Fechamento"
                type="number"
                required
              />
            </div>

            <div className="w-1/2">
              <Label>Data de Vencimento</Label>
              <Required />
              <Input
                min={1}
                max={31}
                name="dt_vencimento"
                placeholder="Data de Vencimento"
                type="number"
                required
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>Bandeira</Label>
              <Required />
              <Select name="bandeira" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {bandeiras.map((item) => (
                    <SelectItem key={item.name} value={item.file}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/bandeiras/${item.file}`}
                          className="rounded-full"
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

            <div className="w-1/2">
              <Label>Tipo do Cartão</Label>
              <Required />
              <Select name="tipo" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                  <SelectItem value="Físico">Físico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <Label>Limite</Label>
            <Required />
            <MoneyInput name="limite" placeholder="R$ 0,00" />
          </div>

          <div className="w-full">
            <Label>Conta Padrão</Label>
            <Required />
            <Select name="conta_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {getAccountMap?.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>Anotação</Label>
            <Textarea name="anotacao" placeholder="Anotação" />
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
