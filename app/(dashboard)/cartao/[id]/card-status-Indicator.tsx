"use client";
import { Card } from "@/components/ui/card";
import { RiCheckboxCircleLine } from "@remixicon/react";

export default function CardStatusIndicator({ fatura_status }) {
  const isPaga = Array.isArray(fatura_status) && fatura_status.length > 0;

  if (!isPaga) return null;

  return (
    <Card className="my-3 flex-row items-center gap-3 bg-green-100 p-4 text-green-900 dark:bg-green-900/40 dark:text-green-100">
      <RiCheckboxCircleLine
        className="h-5 w-5 text-green-900 dark:text-green-100"
        aria-hidden="true"
      />
      <p className="font-semibold">Fatura paga com sucesso</p>
    </Card>
  );
}
