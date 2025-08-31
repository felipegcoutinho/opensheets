"use client";

import { Button } from "@/components/ui/button";
import { Table as TanstackTable } from "@tanstack/react-table"; // Renomeado
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

export function TransactionTablePagination<TData>({
  table,
}: TransactionTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
      </div>
      <div className="text-muted-foreground text-sm">
        Total de Lançamentos: {table.getFilteredRowModel().rows.length}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Página {pageIndex + 1} de {pageCount || 1}
        </div>
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
        <Select
          value={String(pageSize)}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Linhas" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 50, 100].map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
