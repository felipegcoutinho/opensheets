import MoneyValues from "@/components/money-values";
import { RiCheckboxCircleFill, RiHourglass2Fill } from "@remixicon/react";

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
    if (total === 0) {
      return 0;
    }
    return (value / total) * 100;
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-muted-foreground mb-1 text-sm">{title}</h1>
        <MoneyValues value={total} />
      </div>

      {/* Barra de progresso */}
      <div className="mb-4 flex h-4 w-full overflow-hidden rounded">
        {total > 0 ? (
          values.map((value, index) => (
            <div
              key={index}
              className={`h-full ${value.color}`}
              style={{ width: `${calculatePercentage(value.amount)}%` }}
            />
          ))
        ) : (
          <div className="h-full w-full bg-zinc-200 dark:bg-zinc-200" />
        )}
      </div>

      <div className="flex justify-between">
        {values.map((value, index) => {
          return (
            <div key={index} className="flex items-center text-sm">
              {value.label === "confirmados" ? (
                <RiCheckboxCircleFill
                  className={`${title === "A Receber" ? "text-chart-1" : "text-chart-2"} mr-1 h-3 w-3`}
                />
              ) : (
                <RiHourglass2Fill className="mr-1 h-3 w-3 text-zinc-400" />
              )}

              <MoneyValues value={value.amount} />
              <span className="text-muted-foreground ml-1">{value.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
