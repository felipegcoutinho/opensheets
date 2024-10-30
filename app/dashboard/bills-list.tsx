import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { UseDates } from "@/hooks/use-dates";
import { Check } from "lucide-react";
import PayBills from "../../components/pay-bills";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BillsList({ month }) {
  const data = await getBillsByResponsavel(month);

  const { DateFormat } = UseDates();

  return (
    <>
      {data.length > 0 ? (
        data.map((item) => (
          <div key={item.cartao_id}>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700">
              <div>
                <p className="text-lg font-bold">{item.descricao}</p>
                {item.status_pagamento === "Pendente" ? (
                  <p className="text-sm text-muted-foreground">
                    Vence {DateFormat(item.dt_vencimento)}
                  </p>
                ) : (
                  <Check className="text-green-500" size={16} />
                )}
              </div>

              <div className="py-1 text-right">
                <p className="font-bold">
                  <Numbers number={item.valor} />
                </p>
                {item.status_pagamento === "Pago" ? (
                  <Button className="h-6" variant="success" type="button">
                    Pago
                  </Button>
                ) : (
                  <PayBills
                    descricao={item.descricao}
                    valor={item.valor}
                    id={item.id}
                  />
                )}
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
