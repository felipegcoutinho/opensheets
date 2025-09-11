import { Button } from "@/components/ui/button";
import { getMonth } from "@/hooks/get-month";
import CreateNotes from "./modal/create-notes";
import NotesList from "./ui-notes-list";

export default async function page({ searchParams }: { searchParams?: { periodo?: string } }) {
  const month = await getMonth({ searchParams });
  return (
    <div className="mt-4">
      <CreateNotes>
        <Button className="transition-all hover:scale-110">
          Nova Anotação
        </Button>
      </CreateNotes>

      <NotesContent month={month} />
    </div>
  );
}


async function NotesContent({ month }: { month: string }) {
  const { getNotes } = await import("@/app/actions/notes/fetch_notes");
  const notes = await getNotes();
  return <NotesList notes={notes} />;
}
