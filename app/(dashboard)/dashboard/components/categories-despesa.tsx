import WidgetCard from "@/components/widget-card";
import { RiFileList2Line } from "@remixicon/react";
import CategoryWidget from "../categories-widget";
import { buildPainelData } from "../utils";

export default async function CategoriesDespesaSection({
  month,
}: {
  month: string;
}) {
  const data = await buildPainelData(month);
  return (
    <WidgetCard
      title="Despesas por Categoria"
      subtitle="Principais categorias"
      information="Apenas transações do usuário"
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiFileList2Line className="size-4" />
        </span>
      }
    >
      <CategoryWidget
        data={data.categoryData}
        previousData={data.previousCategoryData}
        tipo="despesa"
        total={data.expenses}
        month={data.month}
        budgets={data.budgets}
      />
    </WidgetCard>
  );
}
