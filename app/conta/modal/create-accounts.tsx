"use client";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemColor, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Utils from "../utils";

export default function CreateAccount() {
  const { isOpen, setIsOpen, handleSubmit, loading, colorMap } = Utils();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nova Conta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <Label>Descrição</Label>
            <Required />
            <Input name="descricao" placeholder="Descrição" type="text" required />
          </div>

          <div className="w-full">
            <Label>Tipo do Cartão</Label>
            <Required />
            <Select name="tipo_conta" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corrente">Corrente</SelectItem>
                <SelectItem value="Poupança">Poupança</SelectItem>
                <SelectItem value="Investimento">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>Aparencia</Label>
            <Required />
            <Select name="aparencia" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {colorMap.map((color) => (
                    <SelectItemColor key={color.name} value={color.name} color={color.hex}>
                      {color.label}
                    </SelectItemColor>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>Anotação</Label>
            <Textarea name="anotacao" placeholder="Anotação" />
          </div>

          <DialogFooter className="flex gap-2 mt-4">
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
