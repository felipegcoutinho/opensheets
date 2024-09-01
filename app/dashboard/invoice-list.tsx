import { ColorDotInvoice } from "@/components/card-color";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/Numbers";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import InvoicePayment from "../cartao/invoice-payment";

export default function Invoice({ data, month }) {
  return (
    <ul>
      {data.length > 0 ? (
        data.map((item) => (
          <li key={item.cartao_id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <ColorDotInvoice
                  aparencia={item.aparencia}
                  descricao={
                    <Link
                      className="hover:underline flex items-center gap-1"
                      href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}/?periodo=${month}`}
                    >
                      <p>{item.descricao}</p>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  }
                />
                {item.status_pagamento === "Pendente" ? (
                  <p className="text-muted-foreground text-sm pl-8">Vence dia {item.dt_vencimento}</p>
                ) : (
                  <p className="text-muted-foreground text-sm pl-8">{item.status_pagamento}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold">
                  <Numbers number={item.total_valor} />
                </p>
                <InvoicePayment month={month} paramsId={item.cartao_id} />
              </div>
            </div>
          </li>
        ))
      ) : (
        <EmptyCard width={100} height={100} />
      )}
    </ul>
  );
}
