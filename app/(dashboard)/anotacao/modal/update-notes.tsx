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
import { UseDates } from "@/hooks/use-dates";
import Utils from "../utils";

export default function UpdateNotes({
  itemId,
  itemDescricao,
  itemPeriodo,
  itemAnotacao,
}) {
  const { updateLoading, handleUpdate, isOpen, setIsOpen } = Utils();

  const { getMonthOptions } = UseDates();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="p-0">
            editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Anotação</DialogTitle>
          </DialogHeader>

          <form action={handleUpdate}>
            <input type="hidden" name="id" value={itemId} />

            <div className="mb-1 flex w-full gap-2">
              <div className="w-1/2">
                <Label>
                  Descrição
                  <Required />
                </Label>
                <Input
                  defaultValue={itemDescricao}
                  name="descricao"
                  placeholder="Descrição"
                  type="text"
                />
              </div>

              <div className="w-1/2">
                <Label>
                  Período
                  <Required />
                </Label>
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

            <div className="mb-1 flex w-full gap-2">
              <div className="w-full">
                <Label>Anotação</Label>
                <Textarea
                  maxLength={512}
                  className="h-52"
                  defaultValue={itemAnotacao}
                  name="anotacao"
                  placeholder="Anotação"
                />
              </div>
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
    </>
  );
}
