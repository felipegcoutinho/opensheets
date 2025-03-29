import { getFaturas } from "@/app/services/faturas";
import InvoicePaymentDialog from "@/components/Invoice-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function InvoiceCard({ data, month }) {
  const dataSorted = data.sort((a, b) => b.total_valor - a.total_valor);

  if (!dataSorted.length) return <EmptyCard width={100} height={100} />;

  return [...dataSorted].map(async (item) => {
    const fatura_status = await getFaturas(month, item.cartao_id);

    return (
      <div
        key={item.cartao_id}
        className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700"
      >
        <div className="flex items-center gap-2">
          <Image
            src={`/logos/${item.logo_image}`}
            className="rounded-full"
            width={40}
            height={40}
            alt="Logo do cartão"
            quality={100}
          />

          <div>
            <Link
              className="flex items-center gap-1 hover:underline"
              href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}/?periodo=${month}`}
            >
              {item.descricao}
              <ArrowUpRight className="text-muted-foreground h-3 w-3" />
            </Link>

            {item.status_pagamento === "Pendente" ? (
              <p className="text-muted-foreground text-xs">
                Vence dia {item.dt_vencimento}
              </p>
            ) : (
              <Check className="text-green-500" size={16} />
            )}
          </div>
        </div>

        <div className="py-1 text-right">
          <p>
            <MoneyValues value={item.total_valor} />
          </p>

          <InvoicePaymentDialog
            fatura_status={fatura_status}
            month={month}
            cartao_id={item.cartao_id}
            descricao={item.descricao}
            valor={item.total_valor}
            logo_imagem={item.logo_image}
          />
        </div>
      </div>
    );
  });
}
