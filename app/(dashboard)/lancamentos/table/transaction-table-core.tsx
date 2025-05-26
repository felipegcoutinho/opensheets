"use client";

import EmptyCard from "@/components/empty-card"; // Ajuste o caminho
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  Table as TanstackTable,
} from "@tanstack/react-table"; // Renomeado para evitar conflito

interface TransactionTableCoreProps<TData> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, any>[]; // Necessário para o colSpan do EmptyCard
}

export function TransactionTableCore<
  TData extends { categorias?: { nome?: string } },
>({ table, columns }: TransactionTableCoreProps<TData>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className={`whitespace-nowrap ${
                row.original.categorias?.nome === "saldo anterior" && // Acesso seguro
                "bg-linear-to-r from-lime-300/10 to-transparent"
              }`}
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <EmptyCard />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
