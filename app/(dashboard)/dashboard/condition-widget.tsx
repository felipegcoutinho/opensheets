import { getConditions } from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export async function ConditionWidget({ month }) {
  const condicoes = await getConditions(month);

  const condicoesSorted = condicoes.sort((a, b) => b.sum - a.sum);

  return (
    <>
      {condicoesSorted?.length > 0 ? (
        condicoesSorted?.map((item) => (
          <CardContent key={item.condicao} className="grid gap-2 p-0 py-1">
            <div className="flex items-center justify-between">
              <Link
                href={`/dashboard/condicao/${item.condicao}`}
                className="flex items-center gap-1 hover:underline"
              >
                {item.condicao}
                <ArrowUpRight className="text-muted-foreground h-3 w-3" />
              </Link>

              <p>
                <MoneyValues value={item.sum} />
              </p>
            </div>
          </CardContent>
        ))
      ) : (
        <CardContent className="flex items-center justify-start">
          <span className="text-muted-foreground text-lg">
            Não há condições disponíveis.
          </span>
        </CardContent>
      )}
    </>
  );
}
