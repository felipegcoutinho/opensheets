import WidgetCard from "@/components/widget-card";
import { RiFileList2Line } from "@remixicon/react";
import CategoryPurchasesWidget from "../category-purchases-widget";
import { buildPainelData } from "../utils";

export default async function CategoryPurchasesSection({
  month,
}: {
  month: string;
}) {
  const data = await buildPainelData(month);
  return (
    <WidgetCard
      title="Compras por Categoria"
      subtitle="Selecione uma categoria"
      information="Apenas transações do usuário"
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiFileList2Line className="size-4" />
        </span>
      }
    >
      <CategoryPurchasesWidget data={data.transactionsByCategory} />
    </WidgetCard>
  );
}
