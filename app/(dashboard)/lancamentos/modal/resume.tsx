"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import MoneyValues from "@/components/money-values";
import { RiMoneyDollarBoxFill } from "@remixicon/react";

export function ResumoLancamentoCard({
  condicaoResumo,
  valorResumo,
  dataResumo,
  formaResumo,
  quantidadeParcelas,
  recorrenciaResumo,
  periodoResumo,
  responsavelResumo,
}: {
  condicaoResumo: "vista" | "parcelado" | "recorrente";
  valorResumo: number;
  dataResumo?: string;
  formaResumo?: string;
  quantidadeParcelas?: string;
  recorrenciaResumo?: number;
  periodoResumo?: string;
  responsavelResumo?: string;
}) {
  // Helper para data formatada
  const dataFormatada = dataResumo
    ? format(new Date(dataResumo), "dd/MM/yyyy")
    : "—";

  const periodoFormatado = periodoResumo
    ? `${
        periodoResumo.split("-")[0].charAt(0).toUpperCase() +
        periodoResumo.split("-")[0].slice(1)
      } de ${periodoResumo.split("-")[1]}`
    : "—";

  // Mapeamento de ícones por tipo
  const icone = {
    vista: <RiMoneyDollarBoxFill size={20} className="text-amber-500" />,
    parcelado: <RiMoneyDollarBoxFill size={20} className="text-amber-500" />,
    recorrente: <RiMoneyDollarBoxFill size={20} className="text-amber-500" />,
  }[condicaoResumo];

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
      <CardHeader className="flex items-center gap-2 pb-0">
        {icone}
        <CardTitle className="text-amber-900 dark:text-amber-50">
          Resumo do Lançamento
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 pt-2 text-amber-950 dark:text-amber-50">
        {condicaoResumo === "vista" && (
          <>
            <div>
              <p className="text-sm font-medium">Valor Total</p>
              <p>
                <MoneyValues value={valorResumo} />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Data</p>
              <p>{dataFormatada}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Pagamento</p>
              <p>{formaResumo}</p>
            </div>
          </>
        )}

        {condicaoResumo === "parcelado" && quantidadeParcelas && (
          <>
            <div>
              <p className="text-sm font-medium">Parcelas</p>
              <p>
                {quantidadeParcelas}× de{" "}
                <MoneyValues value={valorResumo / Number(quantidadeParcelas)} />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total</p>
              <p>
                <MoneyValues value={valorResumo} />
              </p>
            </div>
          </>
        )}

        {condicaoResumo === "recorrente" && (
          <>
            <div>
              <p className="text-sm font-medium">Valor Recorrente</p>
              <p>
                <MoneyValues value={valorResumo} />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Frequência</p>
              <p>{recorrenciaResumo ? `${recorrenciaResumo} meses` : "—"}</p>
            </div>
          </>
        )}

        <div>
          <p className="text-sm font-medium">Período</p>
          <p>{periodoFormatado}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Responsável</p>
          <p className="capitalize">{responsavelResumo || "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
