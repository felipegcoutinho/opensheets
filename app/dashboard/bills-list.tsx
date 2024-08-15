import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BIllsList({ month }) {
  const invoices = await getBillsByResponsavel(month);

  return (
    <Card className="h-96 max-sm:h-max overflow-y-auto">
      <CardHeader>
        <CardTitle>Boletos</CardTitle>
        <CardDescription>Total de boletos</CardDescription>
      </CardHeader>

      {invoices.length > 0 ? (
        invoices.map((item) => (
          <CardContent className="grid gap-2 pb-2">
            <div className="grid">
              <div className="flex items-center justify-between">
                <span className="text-xl">
                  <span>{item.descricao}</span>
                </span>
                <span className="text-lg text-right p-0 text-muted-foreground">R$ {item.valor}</span>
              </div>

              <span className="text-muted-foreground text-sm">{item.status_pagamento}</span>
            </div>
          </CardContent>
        ))
      ) : (
        <CardContent className="flex items-center justify-center h-64">
          <span className="text-muted-foreground text-lg">Não há boletos disponíveis.</span>
        </CardContent>
      )}
    </Card>
  );
}
