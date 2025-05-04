import CreateBills from "@/app/(dashboard)/boleto/modal/create-bills";
import CreateTransactions from "@/app/(dashboard)/lancamentos/modal/create-transactions";
import { PlusSquare } from "lucide-react";
import { Button } from "../ui/button";
import CreateNotes from "@/app/(dashboard)/anotacao/modal/create-notes";

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
            <PlusSquare className="text-muted-foreground" size={18} />
          </Button>
        </CreateTransactions>
      )}

      {item.name === "boletos" && (
        <CreateBills getAccountMap={contas} getCategorias={categorias}>
          <Button
            className="transition-all hover:scale-110"
            size="icon"
            variant="link"
          >
            <PlusSquare className="text-muted-foreground" size={18} />
          </Button>
        </CreateBills>
      )}

      {item.name === "anotações" && (
        <CreateNotes>
          <Button
            className="transition-all hover:scale-110"
            size="icon"
            variant="link"
          >
            <PlusSquare className="text-muted-foreground" size={18} />
          </Button>
        </CreateNotes>
      )}
    </>
  );
}

export default AddButton;
