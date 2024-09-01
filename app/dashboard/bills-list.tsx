import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BIllsList({ month }) {
  const invoices = await getBillsByResponsavel(month);

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

              <p className={`text-muted-foreground text-sm ${item.status_pagamento === "Pago" ? "text-green-500" : "text-orange-500"}`}>
                {item.status_pagamento}
              </p>
            </div>
          </div>
        ))
      ) : (
        <EmptyCard width={100} height={100} />
      )}
    </>
  );
}
