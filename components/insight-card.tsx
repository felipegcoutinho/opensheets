import { clsx } from "clsx";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

type Tone = "amber" | "lavender" | "mint" | "violet";

const toneStyles: Record<
  Tone,
  { badge: string; card: string; bullet: string }
> = {
  amber: {
    badge: "bg-red-100 text-foreground dark:text-primary-foreground",
    card: "border-border",
    bullet: "marker:text-red-500",
  },
  lavender: {
    badge: "bg-amber-100 text-foreground dark:text-primary-foreground",
    card: "border-border",
    bullet: "marker:text-amber-500",
  },
  mint: {
    badge: "bg-green-100 text-accent-foreground dark:text-primary-foreground",
    card: "border-border",
    bullet: "marker:text-green-500",
  },
  violet: {
    badge: "bg-violet-100 text-foreground dark:text-primary-foreground",
    card: "border-border",
    bullet: "marker:text-violet-500",
  },
};

type InsightCardProps = {
  title: string;
  analysis: string[];
  tone: Tone;
};

export default function InsightCard({
  title,
  analysis,
  tone,
}: InsightCardProps) {
  const palette = toneStyles[tone] ?? toneStyles.lavender;

  return (
    <Card className={clsx("w-full p-6", palette.card)}>
      <Badge className={clsx("text-sm", palette.badge)}>{title}</Badge>
      <ul
        className={clsx(
          "text-primary list-disc pl-4 text-sm leading-snug",
          palette.bullet,
        )}
      >
        {analysis.map((item, idx) => (
          <li
            className="border-border border-b border-dashed py-1.5 last:border-b-0"
            key={idx}
          >
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
