"use client";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react"; // Ícone de sucesso (Lucide já é padrão nos projetos com shadcn)

export default function CardStatusIndicator({ fatura_status }) {
  const isPaga = Array.isArray(fatura_status) && fatura_status.length > 0;

  if (!isPaga) return null;

  return (
    <Card className="bg-primary/10 dark:bg-primary/20 my-2 flex items-center gap-3 p-4 text-green-900 dark:text-green-100">
      <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
      <p className="font-semibold">Fatura paga com sucesso</p>
    </Card>
  );
}
