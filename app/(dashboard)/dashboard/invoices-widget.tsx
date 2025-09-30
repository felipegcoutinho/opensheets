import { getFaturas } from "@/app/actions/invoices/fetch_invoices";
import EmptyCard from "@/components/empty-card";
import InvoicePaymentDialog from "@/components/invoice-payment-dialog";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UseDates } from "@/hooks/use-dates";
import { RiArrowRightSFill } from "@remixicon/react";
import Link from "next/link";

type InvoiceResponsible = {
  id: string | null;
  nome: string | null;
  role: string | null;
  foto: string | null;
  valor: number;
};

type InvoiceWidgetItem = {
  cartao_id: string;
  descricao: string;
  dt_vencimento: string;
  logo_image: string;
  status_pagamento: string;
  total_valor: number;
  responsaveis?: InvoiceResponsible[] | null;
};

type InvoiceWidgetProps = {
  data: InvoiceWidgetItem[];
  month: string;
};

function resolveFotoSrc(foto?: string | null) {
  if (!foto) return undefined;
  if (foto.startsWith("http")) return foto;
  if (foto.startsWith("/")) return foto;
  return `/avatars/${foto}`;
}

function normalizarResponsaveis(item: InvoiceWidgetItem): InvoiceResponsible[] {
  const totalValor = Number(item.total_valor ?? 0);

  const lista = Array.isArray(item.responsaveis)
    ? item.responsaveis
        .map((responsavel) => ({
          id: responsavel?.id ?? null,
          nome: responsavel?.nome ?? "Sem responsável",
          role: responsavel?.role ?? null,
          foto: responsavel?.foto ?? null,
          valor: Number(responsavel?.valor ?? 0),
        }))
        .filter(
          (responsavel) =>
            Number.isFinite(responsavel.valor) && responsavel.valor !== 0,
        )
    : [];

  const somaResponsaveis = lista.reduce(
    (acc, responsavel) => acc + responsavel.valor,
    0,
  );

  const residual = Number.parseFloat(
    (totalValor - somaResponsaveis).toFixed(2),
  );

  if (residual > 0.01 || residual < -0.01) {
    lista.push({
      id: null,
      nome: residual > 0 ? "Sem responsável" : "Ajuste",
      role: null,
      foto: null,
      valor: residual,
    });
  }

  return lista;
}

export default async function InvoiceWidget({
  data,
  month,
}: InvoiceWidgetProps) {
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
        const totalValor = Number(item.total_valor ?? 0);
        const responsaveis = normalizarResponsaveis(item);
        const basePercentual =
          totalValor !== 0
            ? Math.abs(totalValor)
            : responsaveis.reduce(
                (acc, responsavel) => acc + Math.abs(responsavel.valor),
                0,
              );

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
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={`/cartao/${item.cartao_id}/?periodo=${month}`}
                      className="flex items-center gap-1 text-sm font-semibold hover:underline"
                    >
                      {item.descricao}
                      <RiArrowRightSFill
                        className="text-muted-foreground"
                        size={12}
                        aria-hidden
                      />
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        Distribuição por pagador
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Total do cartão:{" "}
                        <MoneyValues value={totalValor} animated={false} />
                      </p>
                    </div>
                    {responsaveis.length ? (
                      <ul className="space-y-3">
                        {responsaveis.map((responsavel) => {
                          const valor = Number(responsavel.valor ?? 0);
                          const percentualBase =
                            basePercentual !== 0
                              ? Math.abs(valor) / basePercentual
                              : 0;
                          const percentual = Math.min(
                            Math.max(percentualBase * 100, 0),
                            100,
                          );
                          const formatado =
                            percentual >= 10
                              ? percentual.toFixed(0)
                              : percentual.toFixed(1);
                          const percentualTexto = `${formatado.replace(/\.0$/, "")}% do total`;
                          const nome = responsavel.nome ?? "Sem responsável";
                          const fotoSrc = resolveFotoSrc(responsavel.foto);
                          const fallback =
                            nome.trim().charAt(0).toUpperCase() || "?";

                          return (
                            <li
                              key={`${responsavel.id ?? "sem-id"}-${nome}`}
                              className="flex items-start gap-3"
                            >
                              <Avatar className="size-8">
                                {fotoSrc ? (
                                  <AvatarImage src={fotoSrc} alt={nome} />
                                ) : null}
                                <AvatarFallback>{fallback}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm leading-tight font-medium capitalize">
                                    {nome}
                                  </span>
                                  <MoneyValues
                                    value={valor}
                                    animated={false}
                                    className="text-sm"
                                  />
                                </div>
                                <div className="text-muted-foreground flex items-center justify-between text-xs">
                                  <span>{percentualTexto}</span>
                                  {responsavel.role ? (
                                    <span className="bg-muted/60 text-muted-foreground/80 rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase">
                                      {responsavel.role}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-xs">
                        Nenhum pagador associado às transações deste cartão
                        neste período.
                      </p>
                    )}
                  </HoverCardContent>
                </HoverCard>

                {(() => {
                  const pago = fatura_status?.find(
                    (f) => f.status_pagamento === "pago",
                  );
                  if (pago) {
                    const texto = pago.created_at
                      ? `Pago em ${DateFormat(String(pago.created_at).slice(0, 10))}`
                      : `Pago até dia ${item.dt_vencimento}`;
                    return (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        {texto}
                      </p>
                    );
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
              <MoneyValues value={totalValor} />

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
