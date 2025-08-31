import BillPaymentDialog from "@/components/bill-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";
import {
  RiBarcodeLine,
  RiCheckboxCircleFill,
  RiCheckLine,
} from "@remixicon/react";

export default async function BillsWidget({ month, data }) {
  const { DateFormat } = UseDates();

  if (!data.length) return <EmptyCard />;

  const dataSorted = data.sort((a, b) => b.valor - a.valor);

  return dataSorted.map((item, index) => (
    <div
      key={`${item.id}${index}`}
      className="flex items-center justify-between border-b border-dashed py-0"
    >
      <div className="flex items-center gap-2">
        <RiBarcodeLine size={28} />

        <div>
          <p className="font-medium capitalize">{item.descricao}</p>
          {(() => {
            if (item.realizado) {
              const dt = item.dt_pagamento_boleto as string | null;
              const texto = dt
                ? `Pago em ${DateFormat(String(dt).slice(0, 10))}`
                : `Pago até dia ${DateFormat(item.data_vencimento)}`;
              return <p className="text-xs text-emerald-700">{texto}</p>;
            }
            return (
              <p className="text-muted-foreground text-xs">
                Vence {DateFormat(item.data_vencimento)}
              </p>
            );
          })()}
        </div>
      </div>

      <div className="py-1 text-right">
        <MoneyValues value={item.valor} />

        <BillPaymentDialog
          descricao={item.descricao}
          valor={item.valor}
          id={item.id}
          status_pagamento={item.realizado}
          dt_pagamento_boleto={item.dt_pagamento_boleto || null}
          data_vencimento={item.data_vencimento}
        />
      </div>
    </div>
  ));
}
