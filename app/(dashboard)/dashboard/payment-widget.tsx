import { getPayment } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { CardContent } from "@/components/ui/card";
import UseStyles from "@/hooks/use-styles";

export async function PaymentWidget({
  month,
  data,
}: {
  month: string;
  data?: any[];
}) {
  const payment = data ?? (await getPayment(month));

  const dataSorted = payment?.sort((a, b) => {
    return b.sum - a.sum;
  });

  if (dataSorted?.length === 0) return <EmptyCard />;

  const { getPaymentIcon } = UseStyles();

  return (
    <>
      {dataSorted?.length > 0 ? (
        dataSorted?.map((item) => (
          <CardContent
            key={item.forma_pagamento}
            className="grid gap-2 border-b border-dashed p-0 py-2 last:border-0"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  {getPaymentIcon(item.forma_pagamento)}
                  <span className="gap-1 text-sm font-semibold capitalize">
                    {item.forma_pagamento}
                  </span>
                </span>

                <MoneyValues value={item.sum} />
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
