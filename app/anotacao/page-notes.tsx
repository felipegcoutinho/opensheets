import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteNotes, getNotes } from "../actions/notes";
import CreateNotes from "./modal/create-notes";
import UpdateNotes from "./modal/update-notes";

async function PageNotes({ month }) {
  const getNotesMap = await getNotes(month);

  return (
    <div className="mt-4 w-full">
      <CreateNotes />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {getNotesMap?.map((item) => (
          <Card className="flex flex-col justify-between" key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{item.descricao}</CardTitle>
            </CardHeader>
            <CardContent className="break-all">{item.anotacao}</CardContent>
            <CardFooter>
              <div className="flex gap-4">
                <UpdateNotes itemId={item.id} itemDescricao={item.descricao} itemAnotacao={item.anotacao} itemPeriodo={item.periodo} />

                <form action={deleteNotes}>
                  <Button className="p-0" variant="link" value={item.id} name="excluir">
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
