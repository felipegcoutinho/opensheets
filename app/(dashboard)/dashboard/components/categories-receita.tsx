import Widget from "@/components/widget";
import { RiFileList2Line } from "@remixicon/react";
import CategoryWidget from "../categories-widget";
import { buildPainelData } from "../utils";

export default async function CategoriesReceitaSection({
  month,
}: {
  month: string;
}) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Receitas por Categoria"
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
        tipo="receita"
        total={data.incomes}
        month={data.month}
        budgets={data.budgets}
      />
    </Widget>
  );
}
