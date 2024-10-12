import Numbers from "@/components/numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConditions } from "../actions/dashboards";

export async function ConditionList({ month }) {
  const condicoes = await getConditions(month);

  return (
    <Card className="h-1/2 overflow-y-auto max-sm:h-max">
      <CardHeader className="pb-3">
        <CardTitle>Condições</CardTitle>
        {/* <CardDescription>Condições em destaque</CardDescription> */}
      </CardHeader>

      {condicoes?.length > 0 ? (
        condicoes?.map((item) => (
          <CardContent className="grid gap-2 py-1">
            <div className="grid">
              <div className="flex items-center justify-between">
                <span className="text-md">{item.condicao}</span>
                <span className="text-muted-foreground">
                  <Numbers number={item.sum} />
                </span>
              </div>
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
