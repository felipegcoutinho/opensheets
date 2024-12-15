import DialogPayment from "@/components/dialog-payment";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Invoice({ data, month }) {
  const sortedData = [...data].sort((a, b) => b.total_valor - a.total_valor);

  return (
    <>
      {sortedData.length > 0 ? (
        sortedData.map((item) => (
          <div key={item.cartao_id}>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900">
              <div className="flex items-center gap-2">
                <Image
                  quality={100}
                  src={`/logos/${item.logo_image}`}
                  className="rounded-none-full"
                  width={40}
                  height={40}
                  alt={"Logo do cartão"}
                />

                <div>
                  <div className="flex items-center gap-1">
                    <Link
                      className="flex items-center hover:underline"
                      href={`/dashboard/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}/?periodo=${month}`}
                    >
                      {item.descricao}
                    </Link>

                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </div>

                  {item.status_pagamento === "Pendente" ? (
                    <p className="text-xs text-muted-foreground">
                      Vence dia {item.dt_vencimento}
                    </p>
                  ) : (
                    <Check className="text-green-500" size={16} />
                  )}
                </div>
              </div>

              <div className="py-1 text-right">
                <p className="font-bold">
                  <Numbers number={item.total_valor} />
                </p>

                <DialogPayment
                  descricao={item.descricao}
                  valor={item.total_valor}
                  month={month}
                  paramsId={item.cartao_id}
                />
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
