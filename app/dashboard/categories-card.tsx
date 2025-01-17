"use client";

import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CategoriesList({ data, month, color }) {
  if (data.length === 0) {
    return <EmptyCard width={100} height={100} />;
  }

  const sortedData = [...data].sort((a, b) => b.sum - a.sum);
  const maxSum = sortedData[0].sum;

  return (
    <>
      {sortedData.map((item, index) => (
        <div key={index} className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <Link
              className="flex items-center gap-1 hover:underline"
              href={`/dashboard/transacao/${encodeURIComponent(item.categoria.toLowerCase())}/${encodeURIComponent(item.tipo_transacao.toLowerCase())}?periodo=${month}`}
            >
              <p>{item.categoria}</p>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
            </Link>
            <p>
              <Numbers value={item.sum} />
            </p>
          </div>
          <Progress
            indicatorColor={color}
            value={(item.sum / maxSum) * 100}
            className="h-1"
          />
        </div>
      ))}
    </>
  );
}
