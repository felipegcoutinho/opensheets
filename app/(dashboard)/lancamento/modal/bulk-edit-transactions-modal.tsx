"use client";

import {
  BUDGET_RULE_BUCKETS,
  formatBucketLabel,
  type BudgetRuleConfig,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { bulkDeleteTransactions } from "@/app/actions/transactions/delete_transactions";
import { bulkUpdateTransactions } from "@/app/actions/transactions/update_transactions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseDates } from "@/hooks/use-dates";
import { RiInformationLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { CategoryCombobox } from "./category-combobox";

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

interface BulkEditTransactionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransactions: TransactionSummary[];
  categories: CategoryOption[];
  budgetRule: BudgetRuleConfig;
  onComplete: (action: "update" | "delete") => void;
}

export function BulkEditTransactionsModal({
  open,
  onOpenChange,
  selectedTransactions,
  categories,
  budgetRule,
  onComplete,
}: BulkEditTransactionsModalProps) {
  const selectedCount = selectedTransactions.length;
  const selectedIds = useMemo(
    () =>
      selectedTransactions
        .map((transaction) => String(transaction.id))
        .filter(Boolean),
    [selectedTransactions],
  );

  const selectedIdsValue = useMemo(() => selectedIds.join(","), [selectedIds]);

  const { getMonthOptions } = UseDates();
  const monthOptions = useMemo(() => getMonthOptions(), [getMonthOptions]);

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
  const [isDeleting, startDeleteTransition] = useTransition();

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

  const transactionTypeSummary = useMemo(() => {
    return selectedTransactions.reduce<Record<string, number>>(
      (acc, transaction) => {
        const key = transaction.tipo_transacao ?? "outros";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {},
    );
  }, [selectedTransactions]);

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

  const handleBulkDelete = () => {
    if (!selectedIdsValue) {
      toast.error("Nenhum lançamento selecionado.");
      return;
    }

    const formData = new FormData();
    formData.set("ids", selectedIdsValue);

    startDeleteTransition(async () => {
      const result = await bulkDeleteTransactions(
        { success: false, message: "" },
        formData,
      );

      if (!result.success) {
        toast.error(result.message || "Erro ao remover lançamentos.");
        return;
      }

      toast.success(result.message || "Lançamentos removidos com sucesso!");
      onComplete("delete");
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
            Ajuste campos compartilhados pelos lançamentos selecionados ou
            remova-os definitivamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="ids" value={selectedIdsValue} />

          <Alert className="border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <RiInformationLine className="mt-0.5" />
            <AlertTitle className="text-sm">Atenção às mudanças</AlertTitle>
            <AlertDescription className="space-y-1 text-xs">
              <p>
                As alterações abaixo serão aplicadas a {selectedCount}{" "}
                lançamentos selecionados. Essa ação é imediata e não pode ser
                desfeita.
              </p>
              {Object.keys(transactionTypeSummary).length > 0 ? (
                <p className="flex flex-wrap gap-1.5 text-xs text-amber-700 dark:text-amber-200/80">
                  {Object.entries(transactionTypeSummary).map(([type, qty]) => (
                    <span
                      key={type}
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 capitalize dark:bg-amber-500/20 dark:text-amber-50"
                    >
                      {qty}{" "}
                      {type === "despesa"
                        ? "despesas"
                        : type === "receita"
                          ? "receitas"
                          : type}
                    </span>
                  ))}
                </p>
              ) : null}
            </AlertDescription>
          </Alert>

          <fieldset className="space-y-2 border-b border-dashed pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-sm">Categoria</Label>
                <p className="text-muted-foreground text-xs">
                  Defina uma nova categoria para todos os lançamentos.
                </p>
              </div>
              <Switch
                checked={applyCategory}
                onCheckedChange={(checked) => setApplyCategory(checked)}
                aria-label="Aplicar nova categoria"
              />
            </div>
            <CategoryCombobox
              name="categoria_id"
              categories={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              disabled={!applyCategory || isSubmitting || isDeleting}
              placeholder="Selecione a categoria"
            />
          </fieldset>

          <fieldset className="space-y-2 border-b border-dashed pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-sm">Regra 50/30/20</Label>
                <p className="text-muted-foreground text-xs">
                  Aplique uma faixa da regra ou remova a marcação atual.
                </p>
              </div>
              <Switch
                checked={applyRule}
                onCheckedChange={(checked) => setApplyRule(checked)}
                aria-label="Aplicar regra 50/30/20"
                disabled={!budgetRule?.ativada}
              />
            </div>
            {!budgetRule?.ativada ? (
              <p className="text-muted-foreground text-xs">
                Ative a regra 50/30/20 nas configurações para liberar este
                ajuste.
              </p>
            ) : (
              <Select
                name="regra_502030_tipo"
                value={ruleSelection}
                onValueChange={setRuleSelection}
                disabled={
                  !applyRule || isSubmitting || isDeleting || disabledByRule
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha como aplicar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__">
                    Remover marcação 50/30/20
                  </SelectItem>
                  {BUDGET_RULE_BUCKETS.map((bucket) => (
                    <SelectItem
                      key={bucket}
                      value={bucket}
                      className="capitalize"
                    >
                      {formatBucketLabel(bucket)} (
                      {budgetRule.percentuais[bucket]}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {applyRule && hasExpense ? (
              <p className="text-muted-foreground text-xs">
                Apenas despesas serão consideradas na distribuição da regra.
              </p>
            ) : null}
          </fieldset>

          <fieldset className="space-y-2 border-b border-dashed pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-sm">Pagador</Label>
                <p className="text-muted-foreground text-xs">
                  Escolha um novo responsável ou remova a vinculação atual.
                </p>
              </div>
              <Switch
                checked={applyPayer}
                onCheckedChange={(checked) => setApplyPayer(checked)}
                aria-label="Aplicar pagador"
              />
            </div>
            <Select
              name="pagador_id"
              value={payerSelection}
              onValueChange={setPayerSelection}
              disabled={
                !applyPayer || isSubmitting || isDeleting || isFetchingPayers
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isFetchingPayers
                      ? "Carregando pagadores..."
                      : "Selecione um pagador ou remova"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__clear__">Remover pagador</SelectItem>
                {payerOptions.map((payer) => (
                  <SelectItem
                    key={payer.id}
                    value={payer.id}
                    className="capitalize"
                  >
                    {payer.nome}
                    {payer.role ? ` • ${payer.role}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fieldset>

          <fieldset className="space-y-2 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-sm">Período</Label>
                <p className="text-muted-foreground text-xs">
                  Atualize o mês/ano de competência para os lançamentos.
                </p>
              </div>
              <Switch
                checked={applyPeriod}
                onCheckedChange={(checked) => setApplyPeriod(checked)}
                aria-label="Aplicar período"
              />
            </div>
            <Select
              name="periodo"
              value={periodSelection}
              onValueChange={setPeriodSelection}
              disabled={!applyPeriod || isSubmitting || isDeleting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="capitalize"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fieldset>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSubmitting || isDeleting}
                  className="w-full sm:w-auto"
                >
                  Remover selecionados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação removerá definitivamente {selectedCount}{" "}
                    lançamentos. Deseja continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.preventDefault();
                      handleBulkDelete();
                    }}
                  >
                    {isDeleting ? "Removendo..." : "Remover"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting || isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? "Aplicando..." : "Aplicar alterações"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
