import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

type InsightCardProps = {
  title: string;
  analysis: string[];
  color: string;
};

export default function InsightCard({
  title,
  analysis,
  color,
}: InsightCardProps) {
  return (
    <Card className="w-full p-6">
      <Badge className={`${color} text-sm text-black`}>{title}</Badge>
      <ul className="text-muted-foreground list-disc pl-4 text-base">
        {analysis.map((item, idx) => (
          <li className="border-b border-dashed py-2 last:border-b-0" key={idx}>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
