import Numbers from "@/components/numbers";
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
        <CardDescription className="font-semibold">{title}</CardDescription>
        <CardTitle className="text-2xl">
          <Numbers value={value} />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-neutral-500">
        anterior <Numbers value={previousValue} />
      </CardContent>
    </Card>
  );
}
