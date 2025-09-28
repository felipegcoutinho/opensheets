"use client";

import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { DEFAULT_BUDGET_RULE } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";
import { useMemo, useState } from "react";
import { BulkEditTransactionsModal } from "../modal/bulk-edit-transactions-modal";
import { getColumns } from "./get-columns";
import { TransactionTableCore } from "./transaction-table-core";
import { TransactionTableFilters } from "./transaction-table-filters";
import { TransactionTableHeaderCard } from "./transaction-table-header";
import { TransactionTablePagination } from "./transaction-table-pagination";
import { useTransactionTableLogic } from "./utilities-table";

interface Transaction {
  id: string | number; // ou o tipo do seu ID
  descricao?: string;
  condicao?: string;
  forma_pagamento?: string;
  responsavel?: string;
  tipo_transacao?: string;
  valor: number;
  categorias?: any;
  data_transacao?: string; // Exemplo, adicione todos os campos relevantes
  conta_id?: string | number;
  cartao_id?: string | number;
  // Adicione outras propriedades conforme necessário
  [key: string]: any; // Para flexibilidade, mas tente ser específico
}

interface TableTransactionProps {
  data: Transaction[];
  getAccount: any;
  getCards: any;
  getCategorias: any;
  hidden?: boolean;
  budgetRule: BudgetRuleConfig;
}

export function TableTransaction({
  data,
  getAccount,
  getCards,
  getCategorias,
  hidden,
  budgetRule,
}: TableTransactionProps) {
  const { getDescricao } = UseStyles();

  const { DateFormat } = UseDates();

  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);

  const {
    table,
    globalFilter,
    setGlobalFilter,
    isAnyFilterActive,
    selectedTransactionSum,
    rowSelection,
    tipoTransacaoOptions,
    condicaoOptions,
    formaPagamentoOptions,
    responsavelOptions,
    categoriaOptions,
    contaCartaoOptions,
    getColumnFilterValue,
    setColumnFilterValue,
    clearAllFilters,
  } = useTransactionTableLogic<Transaction>({
    data,
    columns: getColumns(
      getAccount,
      getCards,
      getCategorias,
      DateFormat,
      hidden,
      budgetRule,
    ),
    getDescricao,
  });

  const selectedTransactions = table
    .getSelectedRowModel()
    .rows.map((row) => row.original as Transaction);

  const categoriesList = useMemo(
    () => (Array.isArray(getCategorias) ? getCategorias : []),
    [getCategorias],
  );

  const safeBudgetRule = budgetRule ?? DEFAULT_BUDGET_RULE;

  const handleBulkComplete = () => {
    table.resetRowSelection();
  };

  const bulkModalOpen = isBulkEditOpen && selectedTransactions.length > 0;

  return (
    <div className="mt-2 w-full">
      <BulkEditTransactionsModal
        open={bulkModalOpen}
        onOpenChange={setIsBulkEditOpen}
        selectedTransactions={selectedTransactions}
        categories={categoriesList}
        budgetRule={safeBudgetRule}
        onComplete={() => {
          handleBulkComplete();
        }}
      />

      <TransactionTableFilters
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        getColumnFilterValue={getColumnFilterValue}
        setColumnFilterValue={setColumnFilterValue}
        getAccount={getAccount}
        getCards={getCards}
        getCategorias={getCategorias}
        hidden={hidden}
        tipoTransacaoOptions={tipoTransacaoOptions}
        condicaoOptions={condicaoOptions}
        formaPagamentoOptions={formaPagamentoOptions}
        responsavelOptions={responsavelOptions}
        categoriaOptions={categoriaOptions}
        contaCartaoOptions={contaCartaoOptions}
        budgetRule={budgetRule}
      />

      <div>
        <CardHeader>
          <TransactionTableHeaderCard
            hidden={hidden}
            isAnyFilterActive={isAnyFilterActive}
            selectedTransactionSum={selectedTransactionSum}
            onClearFilters={clearAllFilters}
            rowSelection={rowSelection}
            onOpenBulkEdit={() => setIsBulkEditOpen(true)}
          />
        </CardHeader>

        <CardContent className="px-4">
          <TransactionTableCore table={table} columns={table.options.columns} />
        </CardContent>
      </div>

      <TransactionTablePagination table={table} />
    </div>
  );
}
