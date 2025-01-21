import Numbers from "@/components/numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConditions } from "../actions/dashboards";

export async function ConditionList({ month }) {
  const condicoes = await getConditions(month);

  const condicoesSorted = condicoes.sort((a, b) => b.sum - a.sum);

  return (
    <Card className="pb-4">
      <CardHeader>
        <CardTitle className="text-sm uppercase dark:text-muted-foreground">
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
          <span className="text-lg text-muted-foreground">
            Não há condições disponíveis.
          </span>
        </CardContent>
      )}
    </Card>
  );
}
