import { cn } from "@/lib/utils";
import { Card, CardTitle } from "./ui/card";

const colorVariantsCard = {
  amber: "bg-gradient-to-tl from-amber-200 to-amber-100 dark:bg-gradient-to-tl dark:from-amber-900 dark:to-neutral-900",
  blue: "bg-gradient-to-tl from-blue-200 to-blue-100 dark:bg-gradient-to-tl dark:from-blue-900 dark:to-neutral-900",
  cyan: "bg-gradient-to-tl from-cyan-200 to-cyan-100 dark:bg-gradient-to-tl dark:from-cyan-900 dark:to-neutral-900",
  emerald: "bg-gradient-to-tl from-emerald-200 to-emerald-100 dark:bg-gradient-to-tl dark:from-emerald-900 dark:to-neutral-900",
  fuchsia: "bg-gradient-to-tl from-fuchsia-200 to-fuchsia-100 dark:bg-gradient-to-tl dark:from-fuchsia-900 dark:to-neutral-900",
  green: "bg-gradient-to-tl from-green-200 to-green-100 dark:bg-gradient-to-tl dark:from-green-900 dark:to-neutral-900",
  indigo: "bg-gradient-to-tl from-indigo-200 to-indigo-100 dark:bg-gradient-to-tl dark:from-indigo-900 dark:to-neutral-900",
  lime: "bg-gradient-to-tl from-lime-200 to-lime-100 dark:bg-gradient-to-tl dark:from-lime-900 dark:to-neutral-900",
  orange: "bg-gradient-to-tl from-orange-200 to-orange-100 dark:bg-gradient-to-tl dark:from-orange-900 dark:to-neutral-900",
  pink: "bg-gradient-to-tl from-pink-200 to-pink-100 dark:bg-gradient-to-tl dark:from-pink-900 dark:to-neutral-900",
  purple: "bg-gradient-to-tl from-purple-200 to-purple-100 dark:bg-gradient-to-tl dark:from-purple-900 dark:to-neutral-900",
  red: "bg-gradient-to-tl from-red-200 to-red-100 dark:bg-gradient-to-tl dark:from-red-900 dark:to-neutral-900",
  rose: "bg-gradient-to-tl from-rose-200 to-rose-100 dark:bg-gradient-to-tl dark:from-rose-900 dark:to-neutral-900",
  sky: "bg-gradient-to-tl from-sky-200 to-sky-100 dark:bg-gradient-to-tl dark:from-sky-900 dark:to-neutral-900",
  teal: "bg-gradient-to-tl from-teal-200 to-teal-100 dark:bg-gradient-to-tl dark:from-teal-900 dark:to-neutral-900",
  violet: "bg-gradient-to-tl from-violet-200 to-violet-100 dark:bg-gradient-to-tl dark:from-violet-900 dark:to-neutral-900",
  yellow: "bg-gradient-to-tl from-yellow-200 to-yellow-100 dark:bg-gradient-to-tl dark:from-yellow-900 dark:to-neutral-900",
  zinc: "bg-gradient-to-tl from-zinc-200 to-zinc-100 dark:bg-gradient-to-tl dark:from-zinc-900 dark:to-neutral-900",
};

const colorVariants = {
  zinc: "bg-zinc-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
};

function CardColor({ aparencia, id, children, styles }) {
  return (
    <Card className={`${colorVariantsCard[aparencia]} ${styles}`} key={id}>
      {children}
    </Card>
  );
}

export default CardColor;

export function ColorDot({ aparencia, descricao }) {
  return (
    <CardTitle className="flex items-center gap-2">
      <div className={cn(colorVariants[aparencia], "w-4 h-4 rounded-full")} />
      {descricao}
    </CardTitle>
  );
}
