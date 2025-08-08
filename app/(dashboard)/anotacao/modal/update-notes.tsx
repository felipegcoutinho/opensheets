"use client";

import { updateNote } from "@/app/actions/notes/update_notes";
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
import { Textarea } from "@/components/ui/textarea";
import { UseDates } from "@/hooks/use-dates";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActionResponse } from "./form-schema";

export default function UpdateNotes({ item }: { item: any }) {
  const { getMonthOptions } = UseDates();
  let parsed: { mode?: string; tasks?: any[]; content?: string } | null = null;
  try {
    parsed = JSON.parse(item.anotacao);
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
        : item.anotacao,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateNote, {
    success: false,
    message: "",
  } as ActionResponse);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
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
        <form
          action={action}
          className="space-y-2"
          onKeyDown={(e) => {
            if (
              e.key === " " &&
              (e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement)
            ) {
              e.stopPropagation();
            }
          }}
        >
          <input type="hidden" name="id" value={item.id} />

          <div className="w-full">
            <Label>
              Descrição
              <Required />
            </Label>
            <Input
              defaultValue={item.descricao}
              name="descricao"
              placeholder="Descrição"
              type="text"
            />
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
              disabled={isPending}
            >
              {isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
