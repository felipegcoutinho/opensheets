"use client";

import InvoicePaymentDialog from "@/components/invoice-payment-dialog";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import MoneyValues from "@/components/money-values";
import Ping from "@/components/ping-icon";
import RemovePaymentButton from "@/components/remove-payment-button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function CardInfo({ item, cardSum, fatura_status, month }) {
  const isPaga = Array.isArray(fatura_status) && fatura_status.length > 0;

  return (
    <Card className="mt-4 w-full gap-2 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PaymentMethodLogo
            url_name={`/logos/${item.logo_image}`}
            width={54}
            height={54}
          />

          <div className="flex flex-col items-start">
            <span className="text-lg font-bold">{item.descricao}</span>
            <span className="w-96 truncate text-sm italic">
              {item.anotacao}
            </span>
          </div>
        </div>
        <Image
          quality={100}
          src={`/bandeiras/${item.bandeira}`}
          width={60}
          height={60}
          className="rounded-lg border"
          alt="Bandeira do cartão"
        />
      </div>

      {/* Dados principais */}
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <Card className="gap-0 p-4">
          <span>Tipo do Cartão</span>
          <span className="font-bold capitalize">{item.tipo}</span>

          <p className="text-muted-foreground mt-2 text-xs uppercase">
            Fechamento
          </p>
          <span className="font-bold">Dia {item.dt_fechamento}</span>

          <p className="text-muted-foreground mt-2 text-xs uppercase">
            Vencimento
          </p>
          <span className="font-bold">Dia {item.dt_vencimento}</span>
        </Card>

        <Card className="gap-0 p-4">
          <p className="text-muted-foreground text-xs uppercase">
            Limite Total
          </p>
          <span className="font-bold">
            <MoneyValues value={item.limite} />
          </span>

          <p className="text-muted-foreground mt-2 text-xs uppercase">
            Conta Padrão
          </p>
          <span className="font-bold">{item.contas.descricao}</span>

          <p className="text-muted-foreground mt-2 text-xs uppercase">Status</p>
          <span className="flex items-center gap-1">
            <Ping
              color={item.status === "ativo" ? "bg-green-500" : "bg-zinc-500"}
            />
            <span className="font-bold capitalize">{item.status}</span>
          </span>
        </Card>

        <Card className="flex flex-col items-start justify-center gap-2 p-4">
          <p className="text-muted-foreground text-xs">VALOR DA FATURA</p>
          <div className="text-2xl font-bold">
            <MoneyValues value={cardSum} />
          </div>

          {isPaga ? (
            <RemovePaymentButton fatura_status={fatura_status} />
          ) : (
            <InvoicePaymentDialog
              key={item.id}
              fatura_status={fatura_status}
              month={month}
              cartao_id={item.id}
              descricao={item.descricao}
              valor={cardSum}
              logo_imagem={item.logo_image}
            />
          )}
        </Card>
      </div>
    </Card>
  );
}
