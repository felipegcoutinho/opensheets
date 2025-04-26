"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Progress } from "@/components/ui/progress";
import UseOptions from "@/hooks/use-options";
import Link from "next/link";
import { ArrowUpRight, CircleDollarSign } from "lucide-react";

export default function CategoriesList({ data, month, color }) {
  const { categoriasDespesa, categoriasReceita } = UseOptions();

  const sortedData = [...data].sort((a, b) => b.sum - a.sum);
  const maxSum = sortedData[0]?.sum || 1;

  function getCategoryIcon(categoria, tipo) {
    const categorias =
      tipo === "receita" ? categoriasReceita : categoriasDespesa;
    const found = categorias.find(
      (cat) => cat?.value?.toLowerCase() === categoria?.toLowerCase(),
    );
    return found?.icon || CircleDollarSign;
  }

  if (!data || data.length === 0) {
    return <EmptyCard />;
  }

  return (
    <div className="space-y-4">
      {sortedData.map((item, index) => {
        const categoria = item.categoria;
        const tipoTransacao = item.tipo_transacao;
        const url = `/dashboard/${categoria}/${tipoTransacao}?periodo=${month}`;

        const IconComponent = getCategoryIcon(categoria, tipoTransacao);

        const iconColor =
          tipoTransacao === "receita"
            ? "text-green-600 dark:text-green-500"
            : "text-red-600 dark:text-red-500";

        return (
          <div key={index} className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <Link
                className="flex items-center gap-1 hover:underline"
                href={url}
              >
                <IconComponent className={`h-4 w-4 ${iconColor}`} />
                <p>{item.categoria}</p>
                <ArrowUpRight className="text-muted-foreground h-3 w-3" />
              </Link>
              <p>
                <MoneyValues value={item.sum} />
              </p>
            </div>
            <Progress
              indicatorColor={color}
              value={(item.sum / maxSum) * 100}
              className="h-1"
            />
          </div>
        );
      })}
    </div>
  );
}
