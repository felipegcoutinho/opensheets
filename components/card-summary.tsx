import MoneyValues from "@/components/money-values";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Ping from "./ping-icon";

export default function CardSummary({ title, value, previousValue, color }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center gap-2">
            <Ping color={color} />
            {title}
          </div>
        </CardTitle>
        <CardDescription className="text-2xl">
          <MoneyValues value={value} />
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-xs">
        anterior <MoneyValues value={previousValue} />
      </CardContent>
    </Card>
  );
}
