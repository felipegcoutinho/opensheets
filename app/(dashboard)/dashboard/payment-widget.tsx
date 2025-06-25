import { getPayment } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { CardContent } from "@/components/ui/card";

export async function PaymentWidget({ month }) {
  const payment = await getPayment(month);

  const dataSorted = payment?.sort((a, b) => {
    return b.sum - a.sum;
  });

  if (dataSorted?.length === 0) return <EmptyCard />;

  return (
    <>
      {dataSorted?.length > 0 ? (
        dataSorted?.map((item) => (
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
