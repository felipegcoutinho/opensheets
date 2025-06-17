"use client";
import Required from "@/components/required-on-forms";
import TasksInput from "@/components/tasks-input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseDates } from "@/hooks/use-dates";
import { useState } from "react";
import UtilitiesAnotacao from "../utilities-anotacao";

export default function UpdateNotes({
  itemId,
  itemDescricao,
  itemPeriodo,
  itemAnotacao,
}) {
  const { updateLoading, handleUpdate, isOpen, setIsOpen } =
    UtilitiesAnotacao();

  const { getMonthOptions } = UseDates();
  let parsed: { mode?: string; tasks?: any[]; content?: string } | null = null;
  try {
    parsed = JSON.parse(itemAnotacao);
  } catch {}
  const initialTasks =
    parsed && parsed.mode === "tarefas" && Array.isArray(parsed.tasks)
      ? parsed.tasks
      : [];
  const [mode, setMode] = useState<"nota" | "tarefas">(
    parsed && parsed.mode === "tarefas" ? "tarefas" : "nota",
  );
  const [note, setNote] = useState(
    parsed && parsed.mode === "nota"
      ? (parsed.content ?? "")
      : parsed
        ? ""
        : itemAnotacao,
  );

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

            <div className="flex w-full gap-2">
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
                  <SelectTrigger className="w-full">
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

            <div className="my-4 flex w-full gap-2">
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
              <div className="flex w-full gap-2">
                <div className="w-full">
                  <Label>Anotação</Label>
                  <Textarea
                    maxLength={1024}
                    className="h-32"
                    name="anotacao"
                    placeholder="Anotação"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === "tarefas" && <TasksInput value={initialTasks} />}

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
