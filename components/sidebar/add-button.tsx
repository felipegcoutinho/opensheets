"use client";

import CreateNotes from "@/app/(dashboard)/anotacao/modal/create-notes";
import CreateTransactions from "@/app/(dashboard)/lancamento/modal/create-transactions";
import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { RiAddCircleLine } from "@remixicon/react";
import { Button } from "../ui/button";

function AddButton({
  item,
  cartoes,
  contas,
  categorias,
  isActive,
  budgetRule,
}: {
  item: any;
  cartoes: any;
  contas: any;
  categorias: any;
  isActive?: boolean;
  budgetRule: BudgetRuleConfig;
}) {
  return (
    <>
      {item.name === "lançamentos" && (
        <CreateTransactions
          getCards={cartoes}
          getAccount={contas}
          getCategorias={categorias}
          budgetRule={budgetRule}
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
