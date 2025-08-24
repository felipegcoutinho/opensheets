import Widget from "@/components/widget";
import { RiFileList2Line } from "@remixicon/react";
import CategoryWidget from "../categories-widget";
import { buildPainelData } from "../utils";

export default async function CategoriesReceitaSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Receitas por Categoria"
      subtitle="Principais categorias"
      information="Apenas transações do usuário"
      icon={
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-sky-400/10 p-1 text-sky-500">
          <RiFileList2Line className="size-4" />
        </span>
      }
    >
      <CategoryWidget data={data.categoryData} tipo="receita" total={data.incomes} month={data.month} budgets={data.budgets} />
    </Widget>
  );
}

