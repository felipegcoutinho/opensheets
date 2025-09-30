import MonthPicker from "@/components/month-picker/month-picker";
import EntityNameSetter from "@/components/entity-name-setter";
import { getMonth } from "@/hooks/get-month";
import CategoryHeaderSection from "./components/header";
import CategoryTableSection from "./components/table";

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
      <EntityNameSetter name={categoria} />
      <MonthPicker />
      <div className="mb-4 space-y-6">
        <CategoryHeaderSection
          id={categoriaId}
          categoria={categoria}
          tipo_transacao={tipoTransacao}
          month={month}
        />

        <CategoryTableSection
          month={month}
          categoria={categoria}
          tipo_transacao={tipoTransacao}
        />
      </div>
    </>
  );
}
