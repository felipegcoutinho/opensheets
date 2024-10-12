import Numbers from "@/components/numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPayment } from "../actions/dashboards";

export async function PaymentList({ month }) {
  const payment = await getPayment(month);

  return (
    <Card className="h-1/2 overflow-y-auto max-sm:h-max">
      <CardHeader className="pb-3">
        <CardTitle>Formas de Pagamento</CardTitle>
        {/* <CardDescription>Pagamentos em destaque</CardDescription> */}
      </CardHeader>

      {payment?.length > 0 ? (
        payment?.map((item) => (
          <CardContent className="grid gap-2 py-1">
            <div className="grid">
              <div className="flex items-center justify-between">
                <span className="text-md">{item.forma_pagamento}</span>
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
            Não há pagamentos disponíveis.
          </span>
        </CardContent>
      )}
    </Card>
  );
}
