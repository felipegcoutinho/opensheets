import DialogPayment from "@/components/dialog-payment";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Invoice({ data, month }) {
  if (!data.length) return <EmptyCard width={100} height={100} />;

  return [...data]
    .sort((a, b) => b.total_valor - a.total_valor)
    .map((invoice) => (
      <div
        key={invoice.cartao_id}
        className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900"
      >
        <div className="flex items-center gap-2">
          <Image
            src={`/logos/${invoice.logo_image}`}
            className="rounded-full"
            width={40}
            height={40}
            alt="Logo do cartão"
            quality={100}
          />

          <div>
            <Link
              className="flex items-center gap-1 hover:underline"
              href={`/dashboard/cartao/${invoice.cartao_id}/${invoice.descricao.toLowerCase()}/?periodo=${month}`}
            >
              {invoice.descricao}
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
            </Link>

            {invoice.status_pagamento === "Pendente" ? (
              <p className="text-xs text-muted-foreground">
                Vence dia {invoice.dt_vencimento}
              </p>
            ) : (
              <Check className="text-green-500" size={16} />
            )}
          </div>
        </div>

        <div className="py-1 text-right">
          <p className="font-bold">
            <Numbers value={invoice.total_valor} />
          </p>
          <DialogPayment
            descricao={invoice.descricao}
            valor={invoice.total_valor}
            month={month}
            paramsId={invoice.cartao_id}
          />
        </div>
      </div>
    ));
}
