"use client";
import { Card } from "@/components/ui/card";
import { RiCheckboxCircleLine } from "@remixicon/react";

export default function CardStatusIndicator({ fatura_status }) {
  const isPaga = Array.isArray(fatura_status) && fatura_status.length > 0;

  if (!isPaga) return null;

  return (
    <Card className="my-3 flex-row items-center gap-3 border-none bg-emerald-200 p-4 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
      <RiCheckboxCircleLine
        className="h-5 w-5 text-emerald-900 dark:text-emerald-100"
        aria-hidden="true"
      />
      <p className="font-semibold">Fatura paga com sucesso</p>
    </Card>
  );
}
