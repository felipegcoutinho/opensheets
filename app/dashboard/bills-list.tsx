import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { UseDates } from "@/hooks/use-dates";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BillsList({ month }) {
  const invoices = await getBillsByResponsavel(month);

  const { DateFormat } = UseDates();

  return (
    <>
      {invoices.length > 0 ? (
        invoices.map((item) => (
          <div className="grid gap-2 pb-2">
            <div className="grid">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">{item.descricao}</p>
                <p className="font-bold">
                  <Numbers number={item.valor} />
                </p>
              </div>
              <div className="flex items-center gap-1">
                <p className={`text-muted-foreground text-sm ${item.status_pagamento === "Pago" ? "text-green-500" : "text-orange-500"}`}>
                  {item.status_pagamento}
                </p>
                <p className="text-muted-foreground text-sm">|</p>
                <p className="text-muted-foreground text-sm">{DateFormat(item.dt_vencimento)}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyCard width={100} height={100} />
      )}
    </>
  );
}
