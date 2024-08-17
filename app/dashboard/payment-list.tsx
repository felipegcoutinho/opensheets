import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPayment } from "../actions/dashboards";

export async function PaymentList({ month }) {
  const payment = await getPayment(month);

  return (
    <Card className="h-1/2 max-sm:h-max overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle>Pagamentos</CardTitle>
        <CardDescription>Pagamentos em destaque</CardDescription>
      </CardHeader>

      {payment?.length > 0 ? (
        payment?.map((item) => (
          <CardContent className="grid gap-2 py-1">
            <div className="grid">
              <div className="flex items-center justify-between">
                <span className="text-md">{item.forma_pagamento}</span>
                <span className="text-muted-foreground"> {Number(item.sum).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
          </CardContent>
        ))
      ) : (
        <CardContent className="flex items-center justify-start">
          <span className="text-muted-foreground text-lg">Não há pagamentos disponíveis.</span>
        </CardContent>
      )}
    </Card>
  );
}
