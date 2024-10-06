import { cn } from "@/lib/utils";
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
  violet: "bg-violet-600",
  purple: "bg-purple-600",
  fuchsia: "bg-fuchsia-600",
  pink: "bg-pink-600",
  rose: "bg-rose-600",
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
          `flex h-5 w-5 items-center justify-center rounded-full`,
        )}
      ></div>
      {descricao}
    </CardTitle>
  );
}

export function ColorDotTable({ aparencia, descricao }) {
  return (
    <CardTitle className="text-md flex items-center gap-2">
      <div
        className={cn(colorVariants[aparencia], `h-3 w-3 rounded-full`)}
      ></div>
      {descricao}
    </CardTitle>
  );
}
