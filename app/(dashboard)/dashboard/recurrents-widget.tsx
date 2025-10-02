import { getTransactionsByConditions } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import UseStyles from "@/hooks/use-styles";

type Props = { month: string };

export default async function RecurrentsWidget({ month }: Props) {
  const transactions = await getTransactionsByConditions("recorrente", month);
  const { getLogo } = UseStyles();

  if (!transactions?.length) return <EmptyCard />;

  return (
    <div className="space-y-1.5">
      {[...transactions]
        .sort((a: any, b: any) =>
          String(a.descricao).localeCompare(String(b.descricao)),
        )
        .map((t: any) => {
          const recorrencias = Number(t.qtde_recorrencia) || 1;
          const valorMensal = Number(t.valor) || 0;
          return (
            <div
              key={t.id}
              className="flex items-center justify-between border-b border-dashed py-1.5 last:border-0"
            >
              <div className="flex min-w-0 items-center gap-2">
                <PaymentMethodLogo
                  url_name={`/logos/${getLogo(t)}`}
                  height={28}
                  width={28}
                />
                <p className="flex items-center gap-1 truncate text-sm capitalize">
                  {t.descricao}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {recorrencias} meses •
                </span>
                <MoneyValues value={valorMensal} />
              </div>
            </div>
          );
        })}
    </div>
  );
}
