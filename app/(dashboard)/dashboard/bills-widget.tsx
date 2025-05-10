import BillPaymentDialog from "@/components/bill-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";
import { Check } from "lucide-react";
import Image from "next/image";

export default async function BillsWidget({ month, data }) {
  const { DateFormat } = UseDates();

  if (!data.length) return <EmptyCard width={100} height={100} />;

  const dataSorted = data.sort((a, b) => b.valor - a.valor);

  return dataSorted.map((item, index) => (
    <div
      key={`${item.id}${index}`}
      className="border-border/50 flex items-center justify-between border-b"
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logos/boleto.svg"
          className="transition-transform duration-300 hover:scale-110 dark:invert dark:filter"
          width={30}
          height={30}
          alt="Logo do cartão"
          quality={100}
        />
        <div>
          <p className="capitalize">{item.descricao}</p>
          {item.realizado === false ? (
            <p className="text-muted-foreground text-xs">
              Vence {DateFormat(item.data_vencimento)}
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
          status_pagamento={item.realizado}
        />
      </div>
    </div>
  ));
}
