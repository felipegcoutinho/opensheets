import { ColorDotInvoice } from "@/components/card-color";
import DialogPayment from "@/components/dialog-payment";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Invoice({ data, month }) {
  return (
    <>
      {data.length > 0 ? (
        data.map((item) => (
          <div key={item.cartao_id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <ColorDotInvoice
                  aparencia={item.aparencia}
                  descricao={
                    <Link
                      className="hover:underline flex items-center gap-1"
                      href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}/?periodo=${month}`}
                    >
                      {item.descricao}
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  }
                />
                {item.status_pagamento === "Pendente" ? <p className="text-muted-foreground text-sm pl-8">Vence dia {item.dt_vencimento}</p> : null}
              </div>
              <div className="text-right">
                <p className="font-bold">
                  <Numbers number={item.total_valor} />
                </p>
                <DialogPayment descricao={item.descricao} valor={item.total_valor} month={month} paramsId={item.cartao_id} />
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
