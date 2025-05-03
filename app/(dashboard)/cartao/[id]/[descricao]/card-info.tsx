"use client";
import Image from "next/image";
import MoneyValues from "@/components/money-values";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InvoicePaymentDialog from "@/components/Invoice-payment-dialog";
import RemovePaymentButton from "@/components/remove-payment-button";

export default function CardInfo({ item, cardSum, fatura_status, month }) {
  const isPaga = Array.isArray(fatura_status) && fatura_status.length > 0;

  return (
    <Card className="w-full p-6">
      {/* Cabeçalho */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={`/logos/${item.logo_image}`}
            alt={`Logo do cartão ${item.descricao}`}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold">{item.descricao}</span>
            <Badge className="mt-1 rounded-full" variant="secondary">
              FATURA ATUAL
            </Badge>
          </div>
        </div>
      </div>

      {/* Dados principais */}
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-muted-foreground text-xs uppercase">
            Tipo do Cartão
          </p>
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

        <Card className="p-4">
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

          <p className="text-muted-foreground mt-2 text-xs uppercase">
            Bandeira
          </p>
          <Image
            quality={100}
            src={`/bandeiras/${item.bandeira}`}
            width={40}
            height={40}
            className="rounded-full"
            alt="Bandeira do cartão"
            priority
          />
        </Card>

        <Card className="flex flex-col items-start justify-center p-4">
          <p className="text-muted-foreground mb-1 text-xs">VALOR DA FATURA</p>
          <div className="mb-2 text-2xl font-bold">
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
