import { getFaturas } from "@/app/services/faturas";
import InvoicePaymentDialog from "@/components/Invoice-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import ArrowUpRight from "remixicon-react/ArrowRightUpLineIcon";
import Check from "remixicon-react/CheckLineIcon";
import Image from "next/image";
import Link from "next/link";

export default async function InvoiceWidget({ data, month }) {
  if (!data || data.length === 0) return <EmptyCard />;

  const dataSorted = [...data].sort((a, b) => b.total_valor - a.total_valor);

  const cartaoIds = dataSorted.map((item) => item.cartao_id);

  const allFaturaStatusPromises = cartaoIds.map((cartaoId) =>
    getFaturas(month, cartaoId),
  );
  const allFaturaStatusResults = await Promise.all(allFaturaStatusPromises);

  const faturaStatusMap = new Map();
  cartaoIds.forEach((cartaoId, index) => {
    faturaStatusMap.set(cartaoId, allFaturaStatusResults[index]);
  });

  return (
    <>
      {dataSorted.map((item) => {
        // Obter o status da fatura do mapa pré-buscado
        const fatura_status = faturaStatusMap.get(item.cartao_id) || [];

        return (
          <div
            key={item.cartao_id}
            className="border-border/50 flex items-center justify-between border-b"
          >
            <div className="flex items-center gap-2">
              <Image
                src={`/logos/${item.logo_image}`}
                className="rounded-full border shadow-sm transition-transform hover:scale-105"
                width={40}
                height={40}
                alt="Logo do cartão"
                quality={100}
              />
              <div>
                <Link
                  className="flex items-center gap-1 hover:underline"
                  href={`/cartao/${item.cartao_id}/?periodo=${month}`}
                >
                  {item.descricao}
                  <ArrowUpRight className="text-muted-foreground h-3 w-3" />
                </Link>

                {fatura_status.length > 0 &&
                fatura_status[0]?.status_pagamento === "pago" ? (
                  <Check className="text-green-500" size={16} />
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Vence dia {item.dt_vencimento}
                  </p>
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
      })}
    </>
  );
}
