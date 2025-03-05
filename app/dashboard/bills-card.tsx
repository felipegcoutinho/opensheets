import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { UseDates } from "@/hooks/use-dates";
import { Check } from "lucide-react";
import Image from "next/image";
import BillPaymentDialog from "../../components/bill-payment-dialog";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BillsCard({ month }) {
  const { DateFormat } = UseDates();

  const data = await getBillsByResponsavel(month);

  if (!data.length) return <EmptyCard width={100} height={100} />;

  const sortedBills = [...data].sort((a, b) => b.valor - a.valor);

  return sortedBills.map((item, index) => (
    <div
      key={`${item.id}-${index}`}
      className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700"
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logos/boleto.svg"
          width={30}
          height={30}
          alt="Logo do cartão"
          quality={100}
        />
        <div>
          <p>{item.descricao}</p>
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
          <Numbers value={item.valor} />
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
