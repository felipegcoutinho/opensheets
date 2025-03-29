import MoneyValues from "@/components/money-values";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardSummary({ title, value, previousValue, color }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-medium">
          <MoneyValues value={value} />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-neutral-500">
        anterior <MoneyValues value={previousValue} />
      </CardContent>
    </Card>
  );
}
