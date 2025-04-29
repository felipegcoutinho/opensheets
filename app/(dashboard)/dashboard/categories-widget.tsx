"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  month: string;
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

          const url = `/dashboard/${encodeURIComponent(item.categoria)}/${encodeURIComponent(item.tipo_transacao)}?periodo=${month}`;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <Link
                  href={url}
                  className="flex items-center gap-2 hover:underline"
                >
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
        {sortedData.length === 0 && <EmptyCard />}
      </CardContent>
    </div>
  );
}
