"use client";

import CreateNotes from "@/app/(dashboard)/anotacao/modal/create-notes";
import CreateTransactions from "@/app/(dashboard)/lancamento/modal/create-transactions";
import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { RiAddCircleLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
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
            className={cn("transition-all hover:scale-110 text-primary group-hover/menu-item:text-sidebar-accent-foreground group-focus-within/menu-item:text-sidebar-accent-foreground",
              isActive && "text-sidebar-accent-foreground"
            )}
            size="icon"
            variant="link"
          >
            <RiAddCircleLine className="transition-colors" size={18} />
          </Button>
        </CreateTransactions>
      )}

      {item.name === "anotações" && (
        <CreateNotes>
          <Button
            className={cn("transition-all hover:scale-110 text-primary group-hover/menu-item:text-sidebar-accent-foreground group-focus-within/menu-item:text-sidebar-accent-foreground",
              isActive && "text-sidebar-accent-foreground"
            )}
            size="icon"
            variant="link"
          >
            <RiAddCircleLine className="transition-colors" size={18} />
          </Button>
        </CreateNotes>
      )}
    </>
  );
}

export default AddButton;
