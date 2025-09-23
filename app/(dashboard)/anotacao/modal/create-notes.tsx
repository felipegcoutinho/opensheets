"use client";
import { createNote } from "@/app/actions/notes/create_notes";
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

type MonthOption = {
  value: string;
  label: string;
};

type Props = {
  children: React.ReactNode;
};

const initialState: ActionResponse = { success: false, message: "" };

export default function CreateNotes({ children }: Props) {
  const { getMonthOptions, formatted_current_month } = UseDates();
  const [mode, setMode] = useState<"nota" | "tarefas">("nota");
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createNote, initialState);
  const month = formatted_current_month;

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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Anotação</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-2">
          <div className="w-full">
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
                  required
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
              disabled={isPending}
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
