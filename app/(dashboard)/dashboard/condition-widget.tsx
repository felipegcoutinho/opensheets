import { getConditions } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { CardContent } from "@/components/ui/card";
import UseStyles from "@/hooks/use-styles";
import { RiArrowRightSFill } from "@remixicon/react";
import Link from "next/link";

export async function ConditionWidget({ month, data }: { month: string; data?: any[] }) {
  const condicoes = data ?? (await getConditions(month));

  const condicoesSorted = condicoes.sort((a, b) => b.sum - a.sum);

  if (condicoesSorted.length === 0) return <EmptyCard />;

  const { getConditionIcon } = UseStyles();

  return (
    <>
      {condicoesSorted?.map((item) => (
        <CardContent
          key={item.condicao}
          className="grid gap-2 border-b border-dashed p-0 py-2 last:border-0"
        >
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/condicao/${item.condicao}?periodo=${month}`}
              className="flex items-center hover:underline"
            >
              <span className="flex items-center gap-1">
                {getConditionIcon(item.condicao)}
                <span className="lowercase">
                  {item.condicao === "vista" ? "à vista" : item.condicao}
                </span>
              </span>
              <RiArrowRightSFill className="text-muted-foreground h-3 w-3" />
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
