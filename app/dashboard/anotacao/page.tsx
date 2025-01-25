import { deleteNotes, getNotes } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import CreateNotes from "./modal/create-notes";
import UpdateNotes from "./modal/update-notes";

async function PageNotes(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getNotesMap = await getNotes(month);

  return (
    <div className="mt-4 w-full">
      <CreateNotes>
        <Button variant="default">Nova Anotação</Button>
      </CreateNotes>

      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {getNotesMap?.map((item) => (
          <Card className="flex flex-col justify-between" key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.descricao}
              </CardTitle>
            </CardHeader>
            <CardContent className="break-all">{item.anotacao}</CardContent>
            <CardFooter>
              <div className="flex gap-4">
                <UpdateNotes
                  itemId={item.id}
                  itemDescricao={item.descricao}
                  itemAnotacao={item.anotacao}
                  itemPeriodo={item.periodo}
                />

                <form action={deleteNotes}>
                  <Button
                    className="p-0"
                    variant="link"
                    value={item.id}
                    name="excluir"
                  >
                    excluir
                  </Button>
                </form>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PageNotes;
