"use client";

import MoneyValues from "@/components/money-values"; // Ajuste o caminho
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

interface TransactionTableHeaderCardProps {
  hidden?: boolean;
  isAnyFilterActive: boolean;
  selectedTransactionSum: number;
  onClearFilters: () => void;
  rowSelection: object; // Para verificar o tamanho
  onOpenBulkEdit: () => void;
}

export function TransactionTableHeaderCard({
  hidden,
  isAnyFilterActive,
  selectedTransactionSum,
  onClearFilters,
  rowSelection,
  onOpenBulkEdit,
}: TransactionTableHeaderCardProps) {
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <CardTitle className="flex items-center gap-4" hidden={hidden}>
        {selectedCount > 0 && !hidden && (
          <Badge variant={"outline"} className="py-0">
            Total Selecionado:
            <MoneyValues value={selectedTransactionSum} />
          </Badge>
        )}
      </CardTitle>
      <div className="flex flex-wrap items-center gap-2">
        {selectedCount > 0 && !hidden ? (
          <Button size="sm" onClick={onOpenBulkEdit}>
            Editar selecionados
          </Button>
        ) : null}
        {isAnyFilterActive ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={onClearFilters}
          >
            Limpar Filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
