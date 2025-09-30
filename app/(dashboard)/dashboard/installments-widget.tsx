import { getTransactionsByConditions } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Progress } from "@/components/ui/progress";
import { RiCalendarCheckFill } from "@remixicon/react";
import { addMonths, format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  month: string;
};

function calcularMesFinal(periodo: string, qtde: number, atual: number) {
  if (!periodo) return "";
  const dataInicial = parse(periodo, "MMMM-yyyy", new Date(), { locale: ptBR });
  const parcelasRestantes = (Number(qtde) || 0) - (Number(atual) || 0) + 1;
  const dataFinal = addMonths(dataInicial, Math.max(parcelasRestantes - 1, 0));
  let mesFinal = format(dataFinal, "MMMM 'de' yyyy", { locale: ptBR });
  return mesFinal.charAt(0).toUpperCase() + mesFinal.slice(1);
}

export default async function InstallmentsWidget({ month }: Props) {
  const transactions = await getTransactionsByConditions("parcelado", month);

  if (!transactions?.length) return <EmptyCard />;

  return (
    <div className="space-y-1.5">
      {[...transactions]
        .sort((a: any, b: any) => {
          const qa = Number(a.qtde_parcela) || 0;
          const aa = Number(a.parcela_atual) || 0;
          const qb = Number(b.qtde_parcela) || 0;
          const ab = Number(b.parcela_atual) || 0;
          const ra = Math.max(qa - aa, 0);
          const rb = Math.max(qb - ab, 0);
          return ra - rb; // menor parcelas restantes primeiro
        })
        .map((t: any) => {
          const qtde = Number(t.qtde_parcela) || 0;
          const atual = Number(t.parcela_atual) || 0;
          const perc =
            qtde > 0 ? Math.min(100, Math.max(0, (atual / qtde) * 100)) : 0;
          const terminaEm = calcularMesFinal(t.periodo, qtde, atual);
          const valorParcela = Number(t.valor) || 0;
          const restantes = Math.max(qtde - atual, 0);
          const valorRestante = restantes * valorParcela;

          return (
            <div
              key={t.id}
              className="border-b border-dashed py-1 last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm">
                  <span className="items-start gap-1 py-2 text-sm capitalize">
                    {t.descricao}
                  </span>
                  <span className="text-muted-foreground ml-1 text-xs">
                    {atual}/{qtde}
                  </span>

                  {restantes === 0 && (
                    <RiCalendarCheckFill
                      color="green"
                      size={14}
                      className="ml-1 inline"
                    />
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span>
                    <MoneyValues value={valorParcela} />
                  </span>
                </div>
              </div>

              <div className="mt-1">
                <Progress
                  value={perc}
                  primary_color="bg-chart-2"
                  secondary_color="bg-chart-2/20"
                  className="h-1 rounded"
                  aria-label={`Progresso: ${atual} de ${qtde}`}
                />
              </div>

              <div className="text-muted-foreground mt-1 py-1 text-xs">
                Restantes {restantes} • Termina em {terminaEm}{" "}
                {qtde > 1 ? (
                  <span>
                    • Restante <MoneyValues value={valorRestante} />
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
    </div>
  );
}
