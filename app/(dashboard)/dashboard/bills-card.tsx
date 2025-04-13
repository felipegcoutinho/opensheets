import BillPaymentDialog from "@/components/bill-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";
import { Check } from "lucide-react";
import Image from "next/image";

export default async function BillsCard({ month, data }) {
  const { DateFormat } = UseDates();

  if (!data.length) return <EmptyCard width={100} height={100} />;

  const dataSorted = data.sort((a, b) => b.valor - a.valor);

  return dataSorted.map((item, index) => (
    <div
      key={`${item.id}-${index}`}
      className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700"
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logos/boleto.svg"
          className="dark:invert dark:filter"
          width={30}
          height={30}
          alt="Logo do cartão"
          quality={100}
        />
        <div>
          <p className="capitalize">{item.descricao}</p>
          {item.status_pagamento === "Pendente" ? (
            <p className="text-muted-foreground text-xs">
              Vence {DateFormat(item.dt_vencimento)}
            </p>
          ) : (
            <Check className="text-green-500" size={16} />
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
          status_pagamento={item.status_pagamento}
        />
      </div>
    </div>
  ));
}
