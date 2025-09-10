import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import CardHeaderFallback from "@/components/fallbacks/card-header-fallback";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";
import CategoryHeaderSection from "./sections/header";
import CategoryTableSection from "./sections/table";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{
    categoria: string;
    tipo_transacao: string;
    id: string;
  }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const month = await getMonth({ searchParams });

  const { id, categoria: categoriaRaw, tipo_transacao: tipoRaw } = await params;
  const categoriaId = decodeURIComponent(id);
  const categoria = decodeURIComponent(categoriaRaw);
  const tipoTransacao = decodeURIComponent(tipoRaw);

  return (
    <>
      <MonthPicker />
      <div className="mb-4 space-y-6">
        <Suspense fallback={<CardHeaderFallback />}>
          <CategoryHeaderSection
            id={categoriaId}
            categoria={categoria}
            tipo_transacao={tipoTransacao}
            month={month}
          />
        </Suspense>

        <Suspense fallback={<TransactionTableFallback rows={10} />}>
          <CategoryTableSection
            month={month}
            categoria={categoria}
            tipo_transacao={tipoTransacao}
          />
        </Suspense>
      </div>
    </>
  );
}
