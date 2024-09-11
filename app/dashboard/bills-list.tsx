import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { UseDates } from "@/hooks/use-dates";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BillsList({ month }) {
  const data = await getBillsByResponsavel(month);
  const { DateFormat } = UseDates();

  return (
    <>
      {data.length > 0 ? (
        data.map((item) => (
          <div key={item.cartao_id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-lg font-bold">{item.descricao}</p>
                {item.status_pagamento === "Pendente" ? (
                  <p className="text-muted-foreground text-sm">Vence {DateFormat(item.dt_vencimento)}</p>
                ) : null}
              </div>

              <div className="text-right">
                <p className="font-bold">
                  <Numbers number={item.valor} />
                </p>
                {item.status_pagamento === "Pago" ? (
                  <Button className="h-6" variant="success" type="button">
                    Pago
                  </Button>
                ) : (
                  <Button className="h-6" variant="warning" type="button">
                    Pendente
                  </Button>
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
