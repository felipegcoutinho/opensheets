import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { CardTitle, CreditCard } from "./ui/card";

const colorVariantsCard = {
  amber: "bg-amber-400 text-black",
  blue: "bg-blue-600 text-white",
  cyan: "bg-cyan-400 text-black",
  emerald: "bg-emerald-400 text-black",
  fuchsia: "bg-fuchsia-600 text-black",
  green: "bg-green-400 text-black",
  indigo: "bg-indigo-500 text-white",
  lime: "bg-lime-2000 text-black",
  orange: "bg-orange-1000 text-white",
  pink: "bg-pink-600 text-white",
  purple: "bg-purple-600 text-white",
  red: "bg-red-600 text-white",
  rose: "bg-rose-600 text-white",
  sky: "bg-sky-600 text-white",
  teal: "bg-teal-400 text-black",
  violet: "bg-violet-600 text-white",
  yellow: "bg-yellow-1000 text-black",
  zinc: "bg-neutral-800 text-white",
};

const colorVariants = {
  zinc: "bg-neutral-800",
  red: "bg-red-600",
  orange: "bg-orange-1000",
  amber: "bg-amber-400",
  yellow: "bg-yellow-1000",
  lime: "bg-lime-2000",
  green: "bg-green-400",
  emerald: "bg-emerald-400",
  teal: "bg-teal-400",
  cyan: "bg-cyan-400",
  sky: "bg-sky-600",
  blue: "bg-blue-600",
  indigo: "bg-indigo-500",
  violet: "bg-violet-600 hover:bg-violet-700",
  purple: "bg-purple-600",
  fuchsia: "bg-fuchsia-600",
  pink: "bg-pink-600",
  rose: "bg-rose-600",
};

const colorBadgeTable = {
  zinc: "bg-neutral-200 text-neutral-800 hover:bg-neutral-900",
  red: "bg-red-100 text-red-800 hover:bg-red-200",
  orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  amber: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  lime: "bg-lime-100 text-lime-800 hover:bg-lime-200",
  green: "bg-green-100 text-green-800 hover:bg-green-200",
  emerald: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  teal: "bg-teal-100 text-teal-800 hover:bg-teal-200",
  cyan: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  sky: "bg-sky-100 text-sky-800 hover:bg-sky-200",
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  violet: "bg-violet-100 text-violet-800 hover:bg-violet-200",
  purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  fuchsia: "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200",
  pink: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  rose: "bg-rose-100 text-rose-800 hover:bg-rose-200",
};

function CardColor({ aparencia, id, children, styles }) {
  return (
    <CreditCard
      className={`${colorVariantsCard[aparencia]} ${styles} overflow-hidden`}
      key={id}
    >
      {children}
    </CreditCard>
  );
}

export default CardColor;

export function ColorDot({ aparencia, descricao }) {
  return (
    <CardTitle className="flex items-center gap-2 text-2xl">
      {descricao}
    </CardTitle>
  );
}

export function ColorDotInvoice({ aparencia, descricao }) {
  return (
    <CardTitle className="flex items-center gap-2 text-lg">
      <div
        className={cn(
          colorVariants[aparencia],
          `flex h-4 w-1 items-center justify-center`,
        )}
      />
      {descricao}
    </CardTitle>
  );
}

export function BadgeCardTable({ aparencia, descricao }) {
  return (
    <Badge
      className={cn(
        `rounded-full border-transparent ${colorBadgeTable[aparencia]} hover:${colorBadgeTable[aparencia]}`,
      )}
    >
      {descricao}
    </Badge>
  );
}
