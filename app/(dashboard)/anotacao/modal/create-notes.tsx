"use client";
import Required from "@/components/required-on-forms";
import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TasksInput from "@/components/tasks-input";
import { UseDates } from "@/hooks/use-dates";
import UtilitiesAnotacao from "../utilities-anotacao";

type MonthOption = {
  value: string;
  label: string;
};

type Props = {
  children: React.ReactNode;
};

export default function CreateNotes({ children }: Props) {
  const { loading, handleSubmit, isOpen, setIsOpen } = UtilitiesAnotacao();
  const { getMonthOptions } = UseDates();
  const [mode, setMode] = useState<"nota" | "tarefas">("nota");
  const [note, setNote] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Anotação</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-2">
          <div className="mb-1 flex w-full gap-2">
            <div className="w-1/2">
              <Label>
                Título
                <Required />
              </Label>
              <Input
                maxLength={24}
                name="descricao"
                placeholder="Descrição"
                type="text"
                required
              />
            </div>

            <div className="w-1/2">
              <Label>
                Período
                <Required />
              </Label>

              <Select name="periodo" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getMonthOptions().map((option: MonthOption) => (
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
              <Label>Tipo</Label>
              <RadioGroup
                className="mt-1 flex gap-4"
                value={mode}
                onValueChange={(val) => setMode(val as "nota" | "tarefas")}
              >
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="nota" id="modo-nota" />
                  <Label htmlFor="modo-nota">Notas</Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="tarefas" id="modo-tarefas" />
                  <Label htmlFor="modo-tarefas">Tarefas</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {mode === "nota" && (
            <div className="mb-1 flex w-full gap-2">
              <div className="w-full">
                <Label>Anotação</Label>
                <Textarea
                  required
                  maxLength={512}
                  className="h-52"
                  name="anotacao"
                  placeholder="Anotação"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === "tarefas" && <TasksInput />}

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
