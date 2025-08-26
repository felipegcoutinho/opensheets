import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Progress } from "@/components/ui/progress";
import { getTransactionsByConditions } from "@/app/actions/transactions/fetch_transactions";
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
    <div className="space-y-4">
      {transactions.map((t: any) => {
        const qtde = Number(t.qtde_parcela) || 0;
        const atual = Number(t.parcela_atual) || 0;
        const perc = qtde > 0 ? Math.min(100, Math.max(0, (atual / qtde) * 100)) : 0;
        const terminaEm = calcularMesFinal(t.periodo, qtde, atual);
        const totalCompra = (Number(t.valor) || 0) * qtde;

        return (
          <div key={t.id} className="border-b border-dashed pb-3 last:border-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{t.descricao}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Parcela {atual} de {qtde} • Termina em {terminaEm}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">Parcela</p>
                <MoneyValues value={t.valor} />
                {qtde > 1 ? (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Total <MoneyValues value={totalCompra} />
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-2">
              <Progress
                value={perc}
                primary_color="bg-primary"
                secondary_color="bg-secondary"
                className="h-3 rounded"
                aria-label={`Progresso: ${atual} de ${qtde}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

