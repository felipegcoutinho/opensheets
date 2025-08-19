import MoneyValues from "@/components/money-values";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiArrowDownCircleFill,
  RiArrowUpCircleFill,
  RiInformation2Fill,
} from "@remixicon/react";

type Props = {
  title: string;
  value: number;
  previousValue: number;
  color: string;
  information: string;
};

export default function SummaryWidget({
  title,
  value,
  previousValue,
  color,
  information,
}: Props) {
  const isReceitaOuDespesa =
    title.toLowerCase() === "receitas" || title.toLowerCase() === "despesas";

  const diffPercent =
    previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;

  const isPositive = diffPercent >= 0;

  return (
    <Card className="from-primary/2 gap-3 from-20% to-transparent dark:bg-gradient-to-br">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="capitalize">{title}</span>

            <Tooltip>
              <TooltipTrigger>
                <RiInformation2Fill
                  size={16}
                  className="text-muted-foreground/40"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{information}</p>
              </TooltipContent>
            </Tooltip>
          </span>

          <span className="flex items-center">
            {isReceitaOuDespesa && (
              <div
                className={`flex gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {isPositive ? (
                  <RiArrowUpCircleFill size={16} />
                ) : (
                  <RiArrowDownCircleFill size={16} />
                )}
                {isPositive ? "+" : ""}
                <span className="text-xs">{diffPercent.toFixed(0)}%</span>
              </div>
            )}
          </span>
        </CardTitle>

        <CardDescription className="text-2xl">
          <MoneyValues value={value} />
        </CardDescription>
      </CardHeader>

      <CardFooter className="text-muted-foreground flex-col items-start gap-1 text-xs">
        <span>Último mês</span>
        <span>
          <MoneyValues value={previousValue} />
        </span>
      </CardFooter>
    </Card>
  );
}
