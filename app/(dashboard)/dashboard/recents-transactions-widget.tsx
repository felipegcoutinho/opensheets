import EmptyCard from "@/components/empty-card";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";

function RecentesTransactions({ transactions }) {
  function getLogo(item) {
    const contaLogo = item.contas?.logo_image;
    const cartaoLogo = item.cartoes?.logo_image;
    return contaLogo ?? cartaoLogo;
  }

  const { DateFormat } = UseDates();

  if (!transactions.length) return <EmptyCard />;

  return (
    <div className="mb-4">
      {transactions?.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700"
        >
          <div className="flex items-center">
            <PaymentMethodLogo
              url_name={`/logos/${getLogo(item)}`}
              height={40}
              width={40}
            />

            <div className="flex flex-col items-start py-2">
              <p>{item.descricao}</p>
              <p className="text-muted-foreground text-xs">
                {DateFormat(item.data_compra)}
              </p>
            </div>
          </div>

          <p>
            <MoneyValues value={item.valor} />
          </p>
        </div>
      ))}
    </div>
  );
}

export default RecentesTransactions;
