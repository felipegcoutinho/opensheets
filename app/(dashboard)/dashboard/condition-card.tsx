import { getConditions } from "@/app/services/transacoes";
import Numbers from "@/components/numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <p>{item.condicao}</p>
              <p>
                <Numbers value={item.sum} />
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
