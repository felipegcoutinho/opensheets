"use client";

import { Button } from "@/components/ui/button";
import { Table as TanstackTable } from "@tanstack/react-table"; // Renomeado

interface TransactionTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

export function TransactionTablePagination<TData>({
  table,
}: TransactionTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
      </div>
      <div className="text-muted-foreground text-sm">
        Total de Lançamentos: {table.getFilteredRowModel().rows.length}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
