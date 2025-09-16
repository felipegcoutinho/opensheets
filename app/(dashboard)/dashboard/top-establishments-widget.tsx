import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import UseStyles from "@/hooks/use-styles";

type Item = {
  descricao: string;
  count: number;
  total: number;
  sample?: any;
};

export default function TopEstablishmentsWidget({ items }: { items: Item[] }) {
  const { getLogo } = UseStyles();

  if (!items?.length) return <EmptyCard />;

  return (
    <div className="mb-4">
      {items.map((item) => (
        <div
          key={item.descricao}
          className="flex items-center justify-between border-b border-dashed py-0 last:border-0"
        >
          <div className="flex items-center">
            {item.sample ? (
              <PaymentMethodLogo
                url_name={`/logos/${getLogo(item.sample)}`}
                height={32}
                width={32}
              />
            ) : null}
            <div className="flex flex-col items-start py-2">
              {item.descricao}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{item.count}x</span>
            <MoneyValues value={item.total} />
          </div>
        </div>
      ))}
    </div>
  );
}
