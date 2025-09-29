import { clsx } from "clsx";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

type Tone = "amber" | "lavender" | "mint" | "violet";

const toneStyles: Record<
  Tone,
  { badge: string; card: string; bullet: string }
> = {
  amber: {
    badge: "bg-red-200 text-foreground dark:text-primary-foreground",
    card: "border-border bg-gradient-to-b from-red-50/40 from-5% to-transparent dark:from-red-100/20 dark:to-transparent",
    bullet: "marker:text-red-500",
  },
  lavender: {
    badge: "bg-amber-400 text-foreground dark:text-primary-foreground",
    card: "border-border bg-gradient-to-b from-amber-50/40 from-5% to-transparent   dark:from-amber-100/20 dark:to-transparent",
    bullet: "marker:text-amber-500",
  },
  mint: {
    badge: "bg-green-200 text-foreground dark:text-primary-foreground",
    card: "border-border bg-gradient-to-b from-green-50/40 from-5% to-transparent  dark:from-green-100/20 dark:to-transparent",
    bullet: "marker:text-green-500",
  },
  violet: {
    badge: "bg-violet-200 text-foreground dark:text-primary-foreground",
    card: "border-border bg-gradient-to-b from-violet-50/40 from-5% to-transparent  dark:from-violet-100/20 dark:to-transparent",
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
    <Card className={clsx("h-full w-full p-6", palette.card)}>
      <Badge className={clsx("text-sm", palette.badge)}>{title}</Badge>
      <ul
        className={clsx(
          "text-foreground list-disc pl-4 text-sm leading-snug",
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
