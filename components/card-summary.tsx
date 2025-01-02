import Numbers from "@/components/numbers";
import Ping from "@/components/ping-icon";
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
        <CardDescription className="flex items-center gap-1">
          <Ping color={color} />
          {title}
        </CardDescription>
        <CardTitle className="text-2xl">
          <Numbers value={value} />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        anterior <Numbers value={previousValue} />
      </CardContent>
    </Card>
  );
}
