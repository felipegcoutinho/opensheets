import EmptyCard from "@/components/empty-card";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RiCheckboxCircleFill } from "@remixicon/react";
import DeleteNotes from "./modal/delete-notes";
import UpdateNotes from "./modal/update-notes";
import ViewNoteModal from "./modal/view-note";

export default function NotesList({ notes }: { notes: any[] }) {
  if (!notes?.length)
    return (
      <Card className="mt-4 w-full">
        <EmptyCard />
      </Card>
    );
  return (
    <div className="mt-4 mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {notes.map((item) => (
        <Card className="flex h-[350px] flex-col justify-between" key={item.id}>
          <CardHeader className="shrink-0">
            <CardTitle className="flex items-center gap-2">{item.descricao}</CardTitle>
          </CardHeader>
          <CardContent className="mx-4 flex-1 overflow-auto rounded bg-neutral-50 p-4 break-all dark:bg-transparent">
            {(() => {
              try {
                const content = JSON.parse(item.anotacao);
                if (content.mode === "tarefas" && Array.isArray(content.tasks)) {
                  return (
                    <ul className="space-y-1">
                      {content.tasks.map((task: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 border-b border-dashed pb-2 last:border-b-0">
                          <span className={task.done ? "line-through" : ""}>{task.text}</span>
                          {task.done && <RiCheckboxCircleFill color="green" size={16} />}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (content.mode === "nota") return content.content;
              } catch {}
              return item.anotacao;
            })()}
          </CardContent>
          <CardFooter className="shrink-0">
            <div className="flex gap-4 text-sm">
              <UpdateNotes item={item} />
              <ViewNoteModal item={item} />
              <DeleteNotes item={item} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
