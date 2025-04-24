"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  Award,
  Beer,
  Briefcase,
  Car,
  CircleDollarSign,
  Coffee,
  CreditCard,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  History,
  Home,
  Newspaper,
  PiggyBank,
  Plane,
  RefreshCw,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Stars,
  TrendingUp,
  Trophy,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const iconesCategorias = {
  // Receitas
  "ajuste de saldo": History,
  investimentos: TrendingUp,
  plr: Award,
  premios: Trophy,
  presente: Gift,
  reembolso: RefreshCw,
  salario: Briefcase,
  "saldo anterior": Wallet,
  vendas: ShoppingCart,
  rendimentos: PiggyBank,
  outros: CircleDollarSign,
  // Despesas
  alimentacao: UtensilsCrossed,
  assinaturas: Newspaper,
  bares: Beer,
  compras: ShoppingBag,
  "cuidados pessoais": Scissors,
  educacao: GraduationCap,
  emprestimos: PiggyBank,
  "lazer e hobbies": Gamepad2,
  "loteria e apostas": Stars,
  mercado: ShoppingCart,
  moradia: Home,
  pagamentos: CreditCard,
  restaurantes: Coffee,
  roupas: Shirt,
  saude: Heart,
  terceiros: Users,
  trabalho: Briefcase,
  transporte: Car,
  viagem: Plane,
};

export default function CategoriesList({ data, month, color }) {
  if (data.length === 0) {
    return <EmptyCard width={100} height={100} />;
  }

  const sortedData = [...data].sort((a, b) => b.sum - a.sum);
  const maxSum = sortedData[0].sum;

  return (
    <>
      {sortedData.map((item, index) => {
        const categoria = item.categoria;
        const tipoTransacao = item.tipo_transacao.toLowerCase();
        const url = `/dashboard/${categoria}/${tipoTransacao}?periodo=${month}`;

        const categoriaKey = categoria
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const IconComponent =
          iconesCategorias[categoriaKey] || CircleDollarSign;

        const iconColor =
          item.tipo_transacao.toLowerCase() === "receita"
            ? "text-green-600 dark:text-green-500"
            : "text-red-600 dark:text-red-500";

        return (
          <div key={index} className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <Link
                className="flex items-center gap-1 hover:underline"
                href={url}
              >
                <IconComponent className={`h-4 w-4 ${iconColor}`} />
                <p>{item.categoria}</p>
                <ArrowUpRight className="text-muted-foreground h-3 w-3" />
              </Link>
              <p>
                <MoneyValues value={item.sum} />
              </p>
            </div>
            <Progress
              indicatorColor={color}
              value={(item.sum / maxSum) * 100}
              className="h-1"
            />
          </div>
        );
      })}
    </>
  );
}
