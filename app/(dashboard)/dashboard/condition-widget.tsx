import { getConditions } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { CardContent } from "@/components/ui/card";
import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";

export async function ConditionWidget({ month }) {
  const condicoes = await getConditions(month);

  const condicoesSorted = condicoes.sort((a, b) => b.sum - a.sum);

  if (condicoesSorted.length === 0) return <EmptyCard />;

  return (
    <>
      {condicoesSorted?.map((item) => (
        <CardContent key={item.condicao} className="grid gap-2 p-0 py-1">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/condicao/${item.condicao}?periodo=${month}`}
              className="flex items-center gap-1 hover:underline"
            >
              {item.condicao}
              <RiArrowRightUpLine className="text-muted-foreground h-3 w-3" />
            </Link>

            <p>
              <MoneyValues value={item.sum} />
            </p>
          </div>
        </CardContent>
      ))}
    </>
  );
}
