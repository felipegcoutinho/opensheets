import MoneyValues from "@/components/money-values";

interface PaymentSectionProps {
  title: string;
  total: number;
  values: {
    amount: number;
    label: string;
    color: string;
  }[];
}

export function PaymentSection({ title, total, values }: PaymentSectionProps) {
  const calculatePercentage = (value: number) => {
    return (value / total) * 100;
  };

  return (
    <div>
      <h3 className="text-muted-foreground mb-1 text-sm">{title}</h3>
      <p className="text-xl font-bold">
        <MoneyValues value={total} />
      </p>

      {/* Barra de progresso */}
      <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full">
        {values.map((value, index) => (
          <div
            key={index}
            className={`h-full ${value.color}`}
            style={{ width: `${calculatePercentage(value.amount)}%` }}
          />
        ))}
      </div>

      {/* Legenda */}
      <div className="flex justify-between">
        {values.map((value, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className={`mr-2 h-2 w-2 rounded ${value.color}`} />
            <span className="font-bold">
              <MoneyValues value={value.amount} />
            </span>
            <span className="ml-1 text-gray-500">{value.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
