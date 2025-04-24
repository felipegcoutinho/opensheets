import MoneyValues from "@/components/money-values";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Ping from "./ping-icon";

type Props = {
  title: string;
  value: number;
  previousValue: number;
  color: string;
};

export default function CardSummary({
  title,
  value,
  previousValue,
  color,
}: Props) {
  const getPercentageChange = () => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((value - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  };

  const percentageChange = getPercentageChange();
  const isPositive = percentageChange && parseFloat(percentageChange) >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center gap-2 text-base sm:text-lg">
            <Ping color={color} />
            <span>{title}</span>
          </div>
        </CardTitle>
        <CardDescription className="text-foreground text-2xl font-semibold">
          <MoneyValues value={value} />
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-xs">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Anterior: <MoneyValues value={previousValue} />
          </span>
          {percentageChange !== null && (
            <span
              className={`font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {percentageChange}% {isPositive ? "↑" : "↓"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
