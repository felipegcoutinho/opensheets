"use client";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Utils from "../utils";

export default function UpdateNotes({ itemId, itemDescricao, itemPeriodo, itemAnotacao }) {
  const { loading, getMonthOptions, handleUpdate, isOpen, setIsOpen } = Utils();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="p-0">
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Anotação</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <input type="hidden" name="id" value={itemId} />

            <div className="flex w-full gap-2 mb-1">
              <div className="w-1/2">
                <Label>Descrição</Label>
                <Required />
                <Input defaultValue={itemDescricao} name="descricao" placeholder="Descrição" type="text" />
              </div>

              <div className="w-1/2">
                <Label>Período</Label>
                <Required />
                <Select defaultValue={itemPeriodo} name="periodo">
                  <SelectTrigger>
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
            </div>

            <div className="flex w-full gap-2 mb-1">
              <div className="w-full">
                <Label>Anotação</Label>
                <Textarea maxLength={512} className="h-64" defaultValue={itemAnotacao} name="anotacao" placeholder="Anotação" />
              </div>
            </div>

            <DialogFooter className="flex gap-2 mt-4">
              <DialogClose asChild>
                <Button className="w-1/2" type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button className="w-1/2" type="submit" disabled={loading}>
                {loading ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
