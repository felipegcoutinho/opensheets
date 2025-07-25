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
}

export function TransactionTableHeaderCard({
  hidden,
  isAnyFilterActive,
  selectedTransactionSum,
  onClearFilters,
  rowSelection,
}: TransactionTableHeaderCardProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-4" hidden={hidden}>
        Lançamentos
        {Object.keys(rowSelection).length > 0 && !hidden && (
          <Badge variant={"outline"} className="py-0">
            Total Selecionado:
            <MoneyValues value={selectedTransactionSum} />
          </Badge>
        )}
      </CardTitle>
      {isAnyFilterActive && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={onClearFilters}
        >
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
