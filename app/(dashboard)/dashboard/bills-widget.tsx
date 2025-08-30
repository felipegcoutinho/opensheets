import BillPaymentDialog from "@/components/bill-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";
import { RiBarcodeLine, RiCheckLine } from "@remixicon/react";

export default async function BillsWidget({ month, data }) {
  const { DateFormat } = UseDates();

  if (!data.length) return <EmptyCard />;

  const dataSorted = data.sort((a, b) => b.valor - a.valor);

  return dataSorted.map((item, index) => (
    <div
      key={`${item.id}${index}`}
      className="flex items-center justify-between border-b border-dashed py-0 last:border-0"
    >
      <div className="flex items-center gap-2">
        <RiBarcodeLine size={28} />

        <div>
          <p className="font-medium capitalize">{item.descricao}</p>
          {item.realizado === false ? (
            <p className="text-muted-foreground text-xs">
              Vence {DateFormat(item.data_vencimento)}
            </p>
          ) : (
            <RiCheckLine className="text-emerald-600" size={16} />
          )}
        </div>
      </div>

      <div className="py-1 text-right">
        <p>
          <MoneyValues value={item.valor} />
        </p>

        <BillPaymentDialog
          descricao={item.descricao}
          valor={item.valor}
          id={item.id}
          status_pagamento={item.realizado}
        />
      </div>
    </div>
  ));
}
