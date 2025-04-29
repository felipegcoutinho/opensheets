import { getPayment } from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { CardContent } from "@/components/ui/card";

export async function PaymentWidget({ month }) {
  const payment = await getPayment(month);

  return (
    <>
      {payment?.length > 0 ? (
        payment?.map((item) => (
          <CardContent
            key={item.forma_pagamento}
            className="grid gap-2 p-0 py-1"
          >
            <div className="grid">
              <div className="flex items-center justify-between">
                <p className="text-md">{item.forma_pagamento}</p>
                <p>
                  <MoneyValues value={item.sum} />
                </p>
              </div>
            </div>
          </CardContent>
        ))
      ) : (
        <CardContent className="flex items-center justify-start">
          <span className="text-muted-foreground text-lg">
            Não há pagamentos disponíveis.
          </span>
        </CardContent>
      )}
    </>
  );
}
