"use client";

import { CardContent } from "@/components/ui/card";
import MoneyValues from "@/components/money-values";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import EmptyCard from "@/components/empty-card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type CombinedData = {
  tipo_transacao: string;
  categoria: string;
  total: number;
};

type Props = {
  data: CombinedData[];
  totalReceita?: number;
  tipo?: "receita" | "despesa";
  month: string; // <<< ADICIONADO
};

export default function CategoryWidget({
  data,
  totalReceita,
  tipo,
  month,
}: Props) {
  const filteredData = data.filter((item) => item.tipo_transacao === tipo);
  const sortedData = filteredData.sort((a, b) => b.total - a.total);

  if (!data || data.length === 0) {
    return <EmptyCard />;
  }

  return (
    <div>
      <CardContent className="space-y-6 p-0">
        {sortedData.map((item, index) => {
          const percentual = ((item.total / totalReceita) * 100).toFixed(1);

          // Montar URL
          const url = `/dashboard/${encodeURIComponent(item.categoria)}/${encodeURIComponent(item.tipo_transacao)}?periodo=${month}`;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <Link
                  href={url}
                  className="flex items-center gap-2 hover:underline"
                >
                  <div className="bg-muted h-3 w-3 rounded-full" />
                  <span className="font-bold">{item.categoria}</span>
                  <ArrowUpRight className="text-muted-foreground h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    <MoneyValues value={item.total} />
                  </span>

                  <Badge
                    variant={
                      item.tipo_transacao === "receita"
                        ? "defaultGreen"
                        : "defaultRed"
                    }
                  >
                    {percentual}%
                  </Badge>
                </div>
              </div>

              <Progress
                indicatorColor={`${item.tipo_transacao === "receita" ? "bg-green-500" : "bg-red-500"}`}
                value={(item.total / totalReceita) * 100}
                className="h-1"
              />
            </div>
          );
        })}
      </CardContent>
    </div>
  );
}
