import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getConditions } from "../actions/dashboards";

export async function ConditionList({ month }) {
  const condicoes = await getConditions(month);

  return (
    <Card className="h-1/2 max-sm:h-max overflow-y-auto bg-gradient-to-bl from-orange-50 from-5%">
      <CardHeader className="pb-3">
        <CardTitle>Condições</CardTitle>
        <CardDescription>Total de Boletos</CardDescription>
      </CardHeader>

      {condicoes?.map((item) => (
        <CardContent className="grid gap-2 py-1">
          <div className="grid">
            <div className="flex items-center justify-between">
              <span className="text-md">{item.condicao}</span>
              <span className="text-muted-foreground">R$ {item.sum}</span>
            </div>
          </div>
        </CardContent>
      ))}
    </Card>
  );
}
