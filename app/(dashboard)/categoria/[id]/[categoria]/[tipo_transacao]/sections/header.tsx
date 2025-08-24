import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getCategoria } from "@/app/actions/transactions/fetch_transactions";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryIconsMap } from "@/hooks/use-category-icons";

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
  const categorias = await getCategorias();
  const iconName = categorias.find((c) => c.id.toString() === id)?.icone;
  const Icon = iconName ? categoryIconsMap[iconName] : undefined;

  const transacoes = await getCategoria(month, categoria, tipo_transacao);
  const totalTransacoes = transacoes?.reduce((acc, item) => acc + item.valor, 0) || 0;

  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          <CardTitle className="text-xl capitalize">{categoria}</CardTitle>

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <Badge variant={tipo_transacao === "receita" ? "receita" : "despesa"}>
              {tipo_transacao}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">
          <MoneyValues value={totalTransacoes} />
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          Valor total somando os lançamentos por categoria
        </div>
      </CardContent>
    </Card>
  );
}

