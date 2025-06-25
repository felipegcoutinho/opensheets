"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTransactions from "../modal/create-transactions"; // Ajuste o caminho conforme necessário
import TransferBetweenAccounts from "../modal/transfer-between-accounts";
import { ComboboxFilter } from "./combo-filter"; // Ajuste o caminho conforme necessário
import { Table } from "@tanstack/react-table";

interface TransactionTableFiltersProps<TData> {
  table: Table<TData>; // Adicionado para acesso a métodos/estados da tabela se necessário
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  getColumnFilterValue: (columnId: string) => string;
  setColumnFilterValue: (columnId: string, value: string) => void;
  getAccount: any; // Mantenha os tipos originais ou melhore-os
  getCards: any;
  getCategorias: any;
  hidden?: boolean;
  tipoTransacaoOptions: string[];
  condicaoOptions: string[];
  formaPagamentoOptions: string[];
  responsavelOptions: string[];
  categoriaOptions: string[];
  contaCartaoOptions: string[];
}

export function TransactionTableFilters<TData>({
  globalFilter,
  setGlobalFilter,
  getColumnFilterValue,
  setColumnFilterValue,
  getAccount,
  getCards,
  getCategorias,
  hidden,
  tipoTransacaoOptions,
  condicaoOptions,
  formaPagamentoOptions,
  responsavelOptions,
  categoriaOptions,
  contaCartaoOptions,
}: TransactionTableFiltersProps<TData>) {
  if (hidden) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CreateTransactions
        getCards={getCards}
        getAccount={getAccount}
        getCategorias={getCategorias}
      >
        <Button
          variant="default"
          className="w-full transition-all hover:scale-110 sm:w-auto"
        >
          Novo Lançamento
        </Button>
      </CreateTransactions>

      <TransferBetweenAccounts getAccount={getAccount}>
        <Button
          variant="secondary"
          className="w-full transition-all hover:scale-110 sm:w-auto"
        >
          Transferir entre contas
        </Button>
      </TransferBetweenAccounts>

      <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
        <Select
          value={getColumnFilterValue("tipo_transacao")}
          onValueChange={(value) =>
            setColumnFilterValue("tipo_transacao", value)
          }
        >
          <SelectTrigger
            className={`w-full border-dashed sm:w-[140px] ${
              getColumnFilterValue("tipo_transacao") &&
              getColumnFilterValue("tipo_transacao") !== "all"
                ? "ring-primary font-bold ring-2"
                : ""
            }`}
          >
            <SelectValue placeholder="Transação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tipoTransacaoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("condicao")}
          onValueChange={(value) => setColumnFilterValue("condicao", value)}
        >
          <SelectTrigger
            className={`w-full border-dashed sm:w-[140px] ${
              getColumnFilterValue("condicao") &&
              getColumnFilterValue("condicao") !== "all"
                ? "ring-primary font-bold ring-2"
                : ""
            }`}
          >
            <SelectValue placeholder="Condição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {condicaoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("forma_pagamento")}
          onValueChange={(value) =>
            setColumnFilterValue("forma_pagamento", value)
          }
        >
          <SelectTrigger
            className={`w-full border-dashed sm:w-[140px] ${
              getColumnFilterValue("forma_pagamento") &&
              getColumnFilterValue("forma_pagamento") !== "all"
                ? "ring-primary font-bold ring-2"
                : ""
            }`}
          >
            <SelectValue placeholder="Pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {formaPagamentoOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={getColumnFilterValue("responsavel")}
          onValueChange={(value) => setColumnFilterValue("responsavel", value)}
        >
          <SelectTrigger
            className={`w-full border-dashed sm:w-[140px] ${
              getColumnFilterValue("responsavel") &&
              getColumnFilterValue("responsavel") !== "all"
                ? "ring-primary font-bold ring-2"
                : ""
            }`}
          >
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {responsavelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ComboboxFilter
          placeholder="Categoria"
          options={categoriaOptions}
          value={getColumnFilterValue("categoria")}
          onChange={(value) =>
            setColumnFilterValue("categoria", value as string)
          }
        />

        <ComboboxFilter
          placeholder="Conta/Cartão"
          options={contaCartaoOptions}
          value={getColumnFilterValue("conta_cartao")}
          onChange={(value) =>
            setColumnFilterValue("conta_cartao", value as string)
          }
        />

        <Input
          placeholder="Pesquisar"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full sm:w-[140px]"
        />
      </div>
    </div>
  );
}
