import Widget from "@/components/widget";
import { RiFileList2Line } from "@remixicon/react";
import CategoryPurchasesWidget from "../category-purchases-widget";
import { buildPainelData } from "../utils";

export default async function CategoryPurchasesSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Compras por Categoria"
      subtitle="Selecione uma categoria"
      information="Apenas transações do usuário"
      icon={
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-fuchsia-400/10 p-1 text-fuchsia-500">
          <RiFileList2Line className="size-4" />
        </span>
      }
    >
      <CategoryPurchasesWidget data={data.transactionsByCategory} />
    </Widget>
  );
}

