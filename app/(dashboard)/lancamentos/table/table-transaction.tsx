"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UseStyles from "@/hooks/use-styles";
import { getColumns } from "./get-columns";
import { useTransactionTableLogic } from "./utilities-table";
import { TransactionTableHeaderCard } from "./transaction-table-header";
import { TransactionTableCore } from "./transaction-table-core";
import { TransactionTablePagination } from "./transaction-table-pagination";
import { TransactionTableFilters } from "./transaction-table-filters";
import { UseDates } from "@/hooks/use-dates";

interface Transaction {
  id: string | number; // ou o tipo do seu ID
  descricao?: string;
  condicao?: string;
  forma_pagamento?: string;
  responsavel?: string;
  tipo_transacao?: string;
  valor: number;
  categorias?: { nome?: string };
  data_transacao: string; // Exemplo, adicione todos os campos relevantes
  conta_id?: string | number;
  cartao_id?: string | number;
  pagador_id?: string | number; // Adicione o campo pagador_id
  // Adicione outras propriedades conforme necessário
  [key: string]: any; // Para flexibilidade, mas tente ser específico
}

interface TableTransactionProps {
  data: Transaction[];
  getAccount: any;
  getCards: any;
  getCategorias: any;
  getPayers: any;
  hidden?: boolean;
}

export function TableTransaction({
  data,
  getAccount,
  getCards,
  getCategorias,
  getPayers,
  hidden,
}: TableTransactionProps) {
  const { getDescricao } = UseStyles();

  const { DateFormat } = UseDates();

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
      getPayers,
      hidden,
      DateFormat,
    ),
    getDescricao,
  });

  return (
    <div className="mt-4 w-full">
      <TransactionTableFilters
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        getColumnFilterValue={getColumnFilterValue}
        setColumnFilterValue={setColumnFilterValue}
        getAccount={getAccount}
        getCards={getCards}
        getCategorias={getCategorias}
        getPayers={getPayers}
        hidden={hidden}
        tipoTransacaoOptions={tipoTransacaoOptions}
        condicaoOptions={condicaoOptions}
        formaPagamentoOptions={formaPagamentoOptions}
        responsavelOptions={responsavelOptions}
        categoriaOptions={categoriaOptions}
        contaCartaoOptions={contaCartaoOptions}
      />

      <Card>
        <CardHeader>
          <TransactionTableHeaderCard
            hidden={hidden}
            isAnyFilterActive={isAnyFilterActive}
            selectedTransactionSum={selectedTransactionSum}
            onClearFilters={clearAllFilters}
            rowSelection={rowSelection}
          />
        </CardHeader>
        <CardContent className="px-4">
          <TransactionTableCore table={table} columns={table.options.columns} />
        </CardContent>
      </Card>

      <TransactionTablePagination table={table} />
    </div>
  );
}
