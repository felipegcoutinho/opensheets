import CreateNotes from "@/app/(dashboard)/anotacao/modal/create-notes";
import CreateTransactions from "@/app/(dashboard)/lancamentos/modal/create-transactions";
import { RiAddCircleLine } from "@remixicon/react";
import { Button } from "../ui/button";

function AddButton({ item, cartoes, contas, categorias, pagadores }) {
  return (
    <>
      {item.name === "lançamentos" && (
        <CreateTransactions
          getCards={cartoes}
          getAccount={contas}
          getCategorias={categorias}
          getPayers={pagadores}
        >
          <Button
            className="transition-all hover:scale-110"
            size="icon"
            variant="link"
          >
            <RiAddCircleLine className="text-muted-foreground" size={18} />
          </Button>
        </CreateTransactions>
      )}

      {/* This button is used to create transfer between contas, it will show a
      different icon */}
      {/* {item.name === "lançamentos" && (
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
            <RiExchangeDollarLine className="text-muted-foreground" size={18} />
          </Button>
        </CreateTransactions>
      )} */}

      {item.name === "anotações" && (
        <CreateNotes>
          <Button
            className="transition-all hover:scale-110"
            size="icon"
            variant="link"
          >
            <RiAddCircleLine className="text-muted-foreground" size={18} />
          </Button>
        </CreateNotes>
      )}
    </>
  );
}

export default AddButton;
