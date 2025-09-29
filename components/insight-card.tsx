import { RiChatAiLine } from "@remixicon/react";
import { clsx } from "clsx";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

type Tone = "amber" | "lavender" | "mint" | "violet";

const toneStyles: Record<Tone, { badge: string; card: string; icon: string }> =
  {
    amber: {
      badge: "bg-red-200 text-foreground dark:text-primary-foreground",
      card: "border-border bg-gradient-to-b from-red-50/40 from-5% to-transparent dark:from-red-100/20 dark:to-transparent",
      icon: "text-red-500",
    },
    lavender: {
      badge: "bg-amber-400 text-foreground dark:text-primary-foreground",
      card: "border-border bg-gradient-to-b from-amber-50/40 from-5% to-transparent   dark:from-amber-100/20 dark:to-transparent",
      icon: "text-amber-500",
    },
    mint: {
      badge: "bg-green-200 text-foreground dark:text-primary-foreground",
      card: "border-border bg-gradient-to-b from-green-50/40 from-5% to-transparent  dark:from-green-100/20 dark:to-transparent",
      icon: "text-green-500",
    },
    violet: {
      badge: "bg-violet-200 text-foreground dark:text-primary-foreground",
      card: "border-border bg-gradient-to-b from-violet-50/40 from-5% to-transparent  dark:from-violet-100/20 dark:to-transparent",
      icon: "text-violet-500",
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

      <ul className="text-foreground text-sm leading-snug">
        {analysis.map((item, idx) => (
          <li
            key={idx}
            className="border-border group flex items-start gap-2 border-b border-dashed py-2 last:border-b-0"
          >
            <RiChatAiLine
              aria-hidden
              className={clsx("mt-0.5 size-4 shrink-0", palette.icon)}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
