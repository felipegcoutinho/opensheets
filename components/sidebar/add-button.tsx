import CreateNotes from "@/app/(dashboard)/anotacao/modal/create-notes";
import CreateTransactions from "@/app/(dashboard)/lancamentos/modal/create-transactions";
import { CircleFadingPlus } from "lucide-react";
import { Button } from "../ui/button";

function AddButton({ item, cartoes, contas, categorias }) {
  return (
    <>
      {item.name === "lançamentos" && (
        <CreateTransactions
          getCards={cartoes}
          getAccount={contas}
          getCategorias={categorias}
        >
          <Button
            className="transition-all hover:scale-110"
            size="icon"
            variant="link"
          >
            <CircleFadingPlus className="text-muted-foreground" size={18} />
          </Button>
        </CreateTransactions>
      )}

      {item.name === "anotações" && (
        <CreateNotes>
          <Button
            className="transition-all hover:scale-110"
            size="icon"
            variant="link"
          >
            <CircleFadingPlus className="text-muted-foreground" size={18} />
          </Button>
        </CreateNotes>
      )}
    </>
  );
}

export default AddButton;
