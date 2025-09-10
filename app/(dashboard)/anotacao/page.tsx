import { Button } from "@/components/ui/button";
import { getMonth } from "@/hooks/get-month";
import CreateNotes from "./modal/create-notes";
import { Suspense } from "react";
import NotesList from "./ui-notes-list";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);
  return (
    <div className="mt-4">
      <CreateNotes>
        <Button className="transition-all hover:scale-110">
          Nova Anotação
        </Button>
      </CreateNotes>

      <Suspense fallback={<TransactionTableFallback rows={8} /> } >
        <NotesContent month={month} />
      </Suspense>
    </div>
  );
}


async function NotesContent({ month }: { month: string }) {
  const { getNotes } = await import("@/app/actions/notes/fetch_notes");
  const notes = await getNotes(month);
  return <NotesList notes={notes} />;
}
