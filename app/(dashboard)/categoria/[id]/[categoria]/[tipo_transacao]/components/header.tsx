import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getCategoria } from "@/app/actions/transactions/fetch_transactions";

import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import { UseDates } from "@/hooks/use-dates";

import VariationIndicator from "@/components/variation-indicator";

export default async function CategoryHeaderSection({
  id,
  categoria,
  tipo_transacao,
  month,
}: {
  id: string;
  categoria: string;
  tipo_transacao: string;
  month: string;
}) {
  const { getPreviousMonth } = UseDates();
  const previousMonth = getPreviousMonth(month);

  const [categorias, transacoes, previousTransacoes] = await Promise.all([
    getCategorias(),
    getCategoria(month, categoria, tipo_transacao),
    getCategoria(previousMonth, categoria, tipo_transacao),
  ]);

  const iconName = categorias.find((c) => c.id.toString() === id)?.icone;
  const Icon = iconName ? categoryIconsMap[iconName] : undefined;

  const totalTransacoes =
    transacoes?.reduce((acc, item) => acc + Number(item.valor ?? 0), 0) || 0;
  const totalAnterior =
    previousTransacoes?.reduce((acc, item) => acc + Number(item.valor ?? 0), 0) || 0;

  const rawVariation = totalAnterior
    ? ((totalTransacoes - totalAnterior) / totalAnterior) * 100
    : totalTransacoes === 0
      ? 0
      : 100;
  const variation = Number.isFinite(rawVariation) ? rawVariation : 0;

  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          <CardTitle className="text-xl capitalize">{categoria}</CardTitle>

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Badge variant={tipo_transacao === "receita" ? "receita_lite" : "despesa_lite"}>
              {tipo_transacao}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold flex items-center gap-3">
          <MoneyValues value={totalTransacoes} />
          <VariationIndicator variation={variation} className="text-sm" />
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          Valor total somando os lançamentos por categoria
        </div>
      </CardContent>
    </Card>
  );
}
