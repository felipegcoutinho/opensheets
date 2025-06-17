import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useState } from "react";

export type Task = {
  text: string;
  done: boolean;
};

type TasksInputProps = {
  value?: Task[];
  onChange?: (tasks: Task[]) => void;
};

export default function TasksInput({ value = [], onChange }: TasksInputProps) {
  const [tasks, setTasks] = useState<Task[]>(
    value.length > 0 ? value : [{ text: "", done: false }],
  );

  function updateTasks(newTasks: Task[]) {
    setTasks(newTasks);
    onChange?.(newTasks);
  }

  function handleTextChange(index: number, text: string) {
    const newTasks = tasks.slice();
    newTasks[index].text = text;
    updateTasks(newTasks);
  }

  function handleDoneChange(index: number, done: boolean) {
    const newTasks = tasks.slice();
    newTasks[index].done = done;
    updateTasks(newTasks);
  }

  function addTask() {
    updateTasks([...tasks, { text: "", done: false }]);
  }

  function removeTask(index: number) {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasks(newTasks.length > 0 ? newTasks : [{ text: "", done: false }]);
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={task.text}
            onChange={(e) => handleTextChange(index, e.target.value)}
            className={task.done ? "line-through" : ""}
            placeholder={`Tarefa ${index + 1}`}
          />
          <Checkbox
            checked={task.done}
            onCheckedChange={(checked) => handleDoneChange(index, !!checked)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeTask(index)}
          >
            <RiDeleteBinLine className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addTask}
        className="w-full"
      >
        <RiAddLine className="mr-2 size-4" /> Adicionar tarefa
      </Button>

      <input
        type="hidden"
        name="anotacao"
        value={JSON.stringify({ mode: "tarefas", tasks })}
      />
    </div>
  );
}
