import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { UseDates } from "@/hooks/use-dates";
import { Check } from "lucide-react";
import Image from "next/image";
import PayBills from "../../components/pay-bills";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BillsList({ month }) {
  const { DateFormat } = UseDates();

  const data = await getBillsByResponsavel(month);

  const sortedData = [...data].sort((a, b) => b.valor - a.valor);

  return (
    <>
      {sortedData.length > 0 ? (
        sortedData.map((item, index) => (
          <div key={`${item.cartao_id}-${index}`}>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900">
              <div className="flex items-center gap-2">
                <Image
                  quality={100}
                  src={`/logos/boleto.png`}
                  className="rounded-full"
                  width={40}
                  height={40}
                  alt={"Logo do cartão"}
                />
                <div>
                  <p>{item.descricao}</p>
                  {item.status_pagamento === "Pendente" ? (
                    <p className="text-xs text-muted-foreground">
                      Vence {DateFormat(item.dt_vencimento)}
                    </p>
                  ) : (
                    <Check className="text-green-500" size={16} />
                  )}
                </div>
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
