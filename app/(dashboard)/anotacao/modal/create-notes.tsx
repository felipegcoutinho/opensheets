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

export default function CreateNotes({ getAccountMap, children }) {
  const { loading, handleSubmit, isOpen, setIsOpen } = Utils();

  const { getMonthOptions } = UseDates();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Nova Anotação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Anotação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-1 flex w-full gap-2">
            <div className="w-1/2">
              <Label>Título</Label>
              <Required />
              <Input
                maxLength={24}
                name="descricao"
                placeholder="Descrição"
                type="text"
                required
              />
            </div>

            <div className="w-1/2">
              <Label>Período</Label>
              <Required />
              <Select name="periodo" required>
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
                required
                maxLength={512}
                className="h-64"
                name="anotacao"
                placeholder="Anotação"
              />
            </div>
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
