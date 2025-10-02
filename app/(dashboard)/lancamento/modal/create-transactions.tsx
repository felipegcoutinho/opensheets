"use client";
import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseDates } from "@/hooks/use-dates";
import { useMemo } from "react";
import UtilitiesLancamento from "../utilities-lancamento";
import { CreateTransactionForm } from "./create-transaction-form";
import { useCreateTransactionLookups } from "./use-create-transaction-lookups";

type CreateTransactionsProps = {
  getCards: any;
  getAccount: any;
  getCategorias: any;
  children: React.ReactNode;
  defaultDate?: Date | string;
  budgetRule: BudgetRuleConfig;
};

export default function CreateTransactions({
  getCards,
  getAccount,
  getCategorias,
  children,
  defaultDate,
  budgetRule,
}: CreateTransactionsProps) {
  const controller = UtilitiesLancamento();
  const {
    isOpen,
    tipoTransacao,
    handleDialogClose,
    handleCreateSubmit,
    loading,
  } = controller;

  const { getMonthOptions, formatted_current_month, optionsMeses } = UseDates();

  const { month, defaultDateStr, injectedLabel } = useMemo(() => {
    let currentMonth = formatted_current_month;
    let dateStr: string | undefined;
    let label: string | undefined;

    if (defaultDate) {
      const parsedDate =
        defaultDate instanceof Date ? defaultDate : new Date(defaultDate);

      if (!Number.isNaN(parsedDate.getTime())) {
        const monthName = optionsMeses[parsedDate.getMonth()];
        currentMonth = `${monthName}-${parsedDate.getFullYear()}`;
        label = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${parsedDate.getFullYear()}`;
        const year = parsedDate.getFullYear();
        const monthIndex = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        dateStr = `${year}-${monthIndex}-${day}`;
      }
    }

    return {
      month: currentMonth,
      defaultDateStr: dateStr,
      injectedLabel: label,
    };
  }, [defaultDate, formatted_current_month, optionsMeses]);

  const {
    descricaoOptions,
    pagadoresOptions,
    secondPayers,
    selectedPayer,
    setSelectedPayer,
    categoriaId,
    setCategoriaId,
    ruleBucket,
    setRuleBucket,
    isSelectedPayerPrincipal,
    isLoadingDesc,
    isLoadingPayers,
    descError,
    payersError,
    resetSelections,
  } = useCreateTransactionLookups({
    month,
    enabled: isOpen,
    tipoTransacao,
  });

  const onDialogOpenChange = (value: boolean) => {
    handleDialogClose(value);
    if (!value) {
      resetSelections();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>

        {(isLoadingDesc || isLoadingPayers) && <p>Carregando opções...</p>}
        {(descError || payersError) && (
          <p className="text-red-600">
            Erro ao carregar opções:{" "}
            {descError?.message || payersError?.message}
          </p>
        )}

        <div className="-mx-6 max-h-[80vh] overflow-y-auto px-6">
          <CreateTransactionForm
            controller={controller}
            descricaoOptions={descricaoOptions}
            pagadoresOptions={pagadoresOptions}
            secondPayers={secondPayers}
            selectedPayer={selectedPayer}
            onSelectedPayerChange={setSelectedPayer}
            categoriaId={categoriaId}
            onCategoriaChange={setCategoriaId}
            ruleBucket={ruleBucket}
            onRuleBucketChange={setRuleBucket}
            isSelectedPayerPrincipal={isSelectedPayerPrincipal}
            month={month}
            injectedLabel={injectedLabel}
            getMonthOptions={getMonthOptions}
            defaultDateStr={defaultDateStr}
            getCards={getCards}
            getAccount={getAccount}
            getCategorias={getCategorias}
            budgetRule={budgetRule}
            onSubmit={handleCreateSubmit}
            resetSelections={resetSelections}
          />
        </div>

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-1/2"
              type="button"
              variant="secondary"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            form="transaction-form"
            className="w-full sm:w-1/2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
