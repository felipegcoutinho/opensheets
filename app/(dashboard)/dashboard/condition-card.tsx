import { getConditions } from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export async function ConditionList({ month }) {
  const condicoes = await getConditions(month);

  const condicoesSorted = condicoes.sort((a, b) => b.sum - a.sum);

  return (
    <Card className="pb-4">
      <CardHeader>
        <CardTitle className="dark:text-muted-foreground text-sm uppercase">
          Condições de Pagamento
        </CardTitle>
      </CardHeader>

      {condicoesSorted?.length > 0 ? (
        condicoesSorted?.map((item) => (
          <CardContent key={item.condicao} className="grid gap-2 py-1">
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
    </Card>
  );
}
