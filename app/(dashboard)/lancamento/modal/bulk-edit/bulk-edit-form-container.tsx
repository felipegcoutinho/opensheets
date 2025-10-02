"use client";

import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { bulkUpdateTransactions } from "@/app/actions/transactions/update_transactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseDates } from "@/hooks/use-dates";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { BulkEditCategorySection } from "./bulk-edit-category-section";
import { BulkEditFooter } from "./bulk-edit-footer";
import { BulkEditPayerSection } from "./bulk-edit-payer-section";
import { BulkEditPeriodSection } from "./bulk-edit-period-section";
import { BulkEditRuleSection } from "./bulk-edit-rule-section";

type CategoryOption = {
  id: number | string;
  nome: string;
  tipo_categoria: string;
  icone?: string | null;
};

type TransactionSummary = {
  id: string | number;
  tipo_transacao?: string | null;
};

type PayerOption = {
  id: string;
  nome: string;
  role?: string | null;
};

interface BulkEditFormContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransactions: TransactionSummary[];
  categories: CategoryOption[];
  budgetRule: BudgetRuleConfig;
  onComplete: (action: "update" | "delete") => void;
}

export function BulkEditFormContainer({
  open,
  onOpenChange,
  selectedTransactions,
  categories,
  budgetRule,
  onComplete,
}: BulkEditFormContainerProps) {
  const selectedCount = selectedTransactions.length;
  const selectedIds = selectedTransactions
    .map((transaction) => String(transaction.id))
    .filter(Boolean);

  const selectedIdsValue = selectedIds.join(",");

  const { getMonthOptions } = UseDates();
  const monthOptions = getMonthOptions();

  const [applyCategory, setApplyCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const [applyRule, setApplyRule] = useState(false);
  const [ruleSelection, setRuleSelection] = useState<string>("");

  const [applyPayer, setApplyPayer] = useState(false);
  const [payerSelection, setPayerSelection] = useState<string>("");

  const [applyPeriod, setApplyPeriod] = useState(false);
  const [periodSelection, setPeriodSelection] = useState<string>("");

  const [isSubmitting, startTransition] = useTransition();

  const { data: payersResponse, isFetching: isFetchingPayers } = useQuery({
    queryKey: ["payers"],
    queryFn: async () => {
      const response = await fetch("/api/pagadores");
      if (!response.ok) {
        throw new Error("Falha ao carregar pagadores");
      }
      return response.json();
    },
    staleTime: 60_000,
    retry: 1,
  });

  const payerOptions: PayerOption[] = useMemo(() => {
    const payload = payersResponse?.data ?? [];
    return Array.isArray(payload)
      ? payload.filter((p): p is PayerOption => Boolean(p?.id && p?.nome))
      : [];
  }, [payersResponse]);

  const hasExpense = useMemo(
    () =>
      selectedTransactions.some(
        (transaction) => transaction.tipo_transacao === "despesa",
      ),
    [selectedTransactions],
  );

  const resetState = () => {
    setApplyCategory(false);
    setSelectedCategory(undefined);
    setApplyRule(false);
    setRuleSelection("");
    setApplyPayer(false);
    setPayerSelection("");
    setApplyPeriod(false);
    setPeriodSelection("");
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedIdsValue) {
      toast.error("Nenhum lançamento selecionado.");
      return;
    }

    if (!applyCategory && !applyRule && !applyPayer && !applyPeriod) {
      toast.error("Escolha pelo menos uma alteração para aplicar.");
      return;
    }

    if (applyCategory && !selectedCategory) {
      toast.error("Selecione a categoria que deseja aplicar.");
      return;
    }

    if (applyRule) {
      if (!budgetRule?.ativada) {
        toast.error("A regra 50/30/20 está desativada.");
        return;
      }

      if (!ruleSelection) {
        toast.error("Escolha como a regra 50/30/20 será aplicada.");
        return;
      }
    }

    if (applyPayer && !payerSelection) {
      toast.error("Selecione o pagador desejado ou escolha remover.");
      return;
    }

    if (applyPeriod && !periodSelection) {
      toast.error("Selecione o período que deseja definir.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!applyCategory) {
      formData.delete("categoria_id");
    } else if (selectedCategory) {
      formData.set("categoria_id", selectedCategory);
    }

    if (!applyRule || !budgetRule?.ativada) {
      formData.delete("regra_502030_tipo");
    } else {
      formData.set("regra_502030_tipo", ruleSelection);
    }

    if (!applyPayer) {
      formData.delete("pagador_id");
    } else {
      formData.set("pagador_id", payerSelection);
    }

    if (!applyPeriod) {
      formData.delete("periodo");
    } else {
      formData.set("periodo", periodSelection);
    }

    startTransition(async () => {
      const result = await bulkUpdateTransactions(
        { success: false, message: "" },
        formData,
      );

      if (!result.success) {
        toast.error(result.message || "Erro ao atualizar lançamentos.");
        return;
      }

      toast.success(result.message || "Lançamentos atualizados com sucesso!");
      onComplete("update");
      resetState();
      onOpenChange(false);
    });
  };

  const disabledByRule = applyRule && !budgetRule?.ativada;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edição em massa ({selectedCount})</DialogTitle>
          <DialogDescription className="text-xs">
            As alterações abaixo serão aplicadas a {selectedCount} lançamentos
            selecionados. Essa ação é imediata e não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <form id="bulk-edit-form" onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="ids" value={selectedIdsValue} />

          <BulkEditCategorySection
            applyCategory={applyCategory}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onApplyCategoryChange={setApplyCategory}
            disabled={isSubmitting}
            categories={categories}
          />

          <BulkEditRuleSection
            applyRule={applyRule}
            ruleSelection={ruleSelection}
            onRuleChange={setRuleSelection}
            onApplyRuleChange={setApplyRule}
            disabled={!budgetRule?.ativada}
            disabledByRule={disabledByRule}
            budgetRule={budgetRule}
            hasExpense={hasExpense}
          />

          <BulkEditPayerSection
            applyPayer={applyPayer}
            payerSelection={payerSelection}
            onPayerChange={setPayerSelection}
            onApplyPayerChange={setApplyPayer}
            disabled={isSubmitting}
            isFetchingPayers={isFetchingPayers}
            payerOptions={payerOptions}
          />

          <BulkEditPeriodSection
            applyPeriod={applyPeriod}
            periodSelection={periodSelection}
            onPeriodChange={setPeriodSelection}
            onApplyPeriodChange={setApplyPeriod}
            disabled={isSubmitting}
            monthOptions={monthOptions}
          />

          <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
            <BulkEditFooter
              isSubmitting={isSubmitting}
              onCancel={() => handleDialogChange(false)}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
