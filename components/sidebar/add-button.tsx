"use client";

import CreateNotes from "@/app/(dashboard)/anotacao/modal/create-notes";
import CreateTransactions from "@/app/(dashboard)/lancamento/modal/create-transactions";
import { RiAddCircleLine } from "@remixicon/react";
import { Button } from "../ui/button";

function AddButton({
  item,
  cartoes,
  contas,
  categorias,
  isActive,
}: {
  item: any;
  cartoes: any;
  contas: any;
  categorias: any;
  isActive?: boolean;
}) {
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
            <RiAddCircleLine size={18} />
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
            <RiAddCircleLine size={18} />
          </Button>
        </CreateNotes>
      )}
    </>
  );
}

export default AddButton;
