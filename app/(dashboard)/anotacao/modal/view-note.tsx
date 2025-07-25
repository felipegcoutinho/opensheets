"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ViewNoteModal({ item }: { item: any }) {
  const [open, setOpen] = useState(false);

  const renderContent = () => {
    try {
      const content = JSON.parse(item.anotacao);
      if (content.mode === "tarefas" && Array.isArray(content.tasks)) {
        return (
          <ul className="mt-2 space-y-2">
            {content.tasks.map((task: any, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className={task.done ? "line-through" : ""}>
                  {task.text}
                </span>
                {task.done && <span className="text-green-600">✔</span>}
              </li>
            ))}
          </ul>
        );
      }
      if (content.mode === "nota") {
        return <p className="mt-2 whitespace-pre-wrap">{content.content}</p>;
      }
    } catch {
      return <p className="mt-2 whitespace-pre-wrap">{item.anotacao}</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 text-blue-500 hover:underline">
          ver
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.descricao}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
