"use client";
import { Card } from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import { RiCheckboxCircleLine } from "@remixicon/react";

export default function CardStatusIndicator({
  fatura_status,
  vencimento,
}: {
  fatura_status: any[];
  vencimento?: number;
}) {
  const pago = Array.isArray(fatura_status)
    ? fatura_status.find((f) => f.status_pagamento === "pago")
    : undefined;
  if (!pago) return null;

  const { DateFormat } = UseDates();
  const pagamentoLabel = pago.created_at
    ? `Pago em ${DateFormat(String(pago.created_at).slice(0, 10))}`
    : vencimento
      ? `Pago até ${vencimento}`
      : undefined;

  return (
    <Card className="my-3 flex-row items-center gap-3 border-none bg-emerald-200 p-4 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
      <RiCheckboxCircleLine
        className="h-5 w-5 text-emerald-900 dark:text-emerald-100"
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <p className="font-semibold">Fatura paga com sucesso</p>
        {pagamentoLabel && <span className="text-xs">{pagamentoLabel}</span>}
      </div>
    </Card>
  );
}
