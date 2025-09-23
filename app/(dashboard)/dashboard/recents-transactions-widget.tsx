import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";

function RecentesTransactions({ transactions }) {
  const { DateFormat } = UseDates();
  const { getLogo } = UseStyles();

  if (!transactions.length) return <EmptyCard />;

  return (
    <div className="mb-4">
      {transactions?.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-dashed py-0 last:border-0"
        >
          <div className="flex items-center">
            <PaymentMethodLogo
              url_name={`/logos/${getLogo(item)}`}
              height={40}
              width={40}
            />

            <div className="flex flex-col items-start gap-1 py-2 text-sm font-semibold capitalize">
              {item.descricao}
              <span className="text-muted-foreground text-xs font-normal">
                {DateFormat(item.data_compra)}
              </span>
            </div>
          </div>

          <MoneyValues value={item.valor} />
        </div>
      ))}
    </div>
  );
}

export default RecentesTransactions;
