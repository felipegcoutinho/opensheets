import { getFaturas } from "@/app/actions/invoices/fetch_invoices";
import EmptyCard from "@/components/empty-card";
import InvoicePaymentDialog from "@/components/invoice-payment-dialog";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import {
  RiArrowRightSFill,
  RiCheckboxCircleFill,
  RiCheckLine,
} from "@remixicon/react";
import Link from "next/link";
import { UseDates } from "@/hooks/use-dates";

export default async function InvoiceWidget({ data, month }) {
  const { DateFormat } = UseDates();

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
            className="flex items-center justify-between border-b border-dashed py-0"
          >
            <div className="flex items-center">
              <PaymentMethodLogo
                url_name={`/logos/${item.logo_image}`}
                width={40}
                height={40}
              />

              <div>
                <Link
                  className="flex items-center hover:underline"
                  href={`/cartao/${item.cartao_id}/?periodo=${month}`}
                >
                  {item.descricao}
                  <RiArrowRightSFill
                    className="text-muted-foreground"
                    size={12}
                  />
                </Link>

                {(() => {
                  const pago = fatura_status?.find(
                    (f) => f.status_pagamento === "pago",
                  );
                  if (pago) {
                    const texto = pago.created_at
                      ? `Pago em ${DateFormat(String(pago.created_at).slice(0, 10))}`
                      : `Pago até dia ${item.dt_vencimento}`;
                    return <p className="text-xs text-emerald-700">{texto}</p>;
                  }
                  return (
                    <p className="text-muted-foreground text-xs">
                      Vence dia {item.dt_vencimento}
                    </p>
                  );
                })()}
              </div>
            </div>
            <div className="py-1 text-right">
              <MoneyValues value={item.total_valor} />

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
