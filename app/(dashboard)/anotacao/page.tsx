import { getNotes } from "@/app/actions/notes/fetch_notes";
import EmptyCard from "@/components/empty-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonth } from "@/hooks/get-month";
import { RiCheckboxCircleFill } from "@remixicon/react";
import CreateNotes from "./modal/create-notes";
import DeleteNotes from "./modal/delete-notes";
import UpdateNotes from "./modal/update-notes";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);
  const notes = await getNotes(month);

  return (
    <div className="mt-4">
      <CreateNotes>
        <Button className="transition-all hover:scale-110">
          Nova Anotação
        </Button>
      </CreateNotes>

      {notes.length === 0 && (
        <Card className="mt-4 w-full">
          <EmptyCard />
        </Card>
      )}

      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((item) => (
          <Card className="flex flex-col justify-between" key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.descricao}
              </CardTitle>
            </CardHeader>
            <CardContent className="break-all">
              {(() => {
                try {
                  const content = JSON.parse(item.anotacao);
                  if (
                    content.mode === "tarefas" &&
                    Array.isArray(content.tasks)
                  ) {
                    return (
                      <ul className="space-y-1">
                        {content.tasks.map((task: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            {/* <Checkbox checked={task.done} disabled /> */}
                            <span className={task.done ? "line-through" : ""}>
                              {task.text}
                            </span>
                            {task.done && (
                              <RiCheckboxCircleFill color="green" size={16} />
                            )}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (content.mode === "nota") {
                    return content.content;
                  }
                } catch {}
                return item.anotacao;
              })()}
            </CardContent>
            <CardFooter>
              <div className="flex gap-4 text-sm">
                <UpdateNotes
                  itemId={item.id}
                  itemDescricao={item.descricao}
                  itemAnotacao={item.anotacao}
                  itemPeriodo={item.periodo}
                />

                <DeleteNotes itemId={item.id} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
