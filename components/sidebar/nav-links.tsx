import {
  ArrowRightLeft,
  CreditCard,
  File,
  LayoutDashboard,
  Pen,
  PiggyBank,
  Users,
} from "lucide-react";

export function NavLinks(month: string, stats: any) {
  return {
    projects: [
      {
        name: "dashboard",
        url: `/dashboard?periodo=${month}`,
        icon: LayoutDashboard,
      },
      {
        name: "lançamentos",
        url: `/lancamentos?periodo=${month}`,
        icon: ArrowRightLeft,
        count: stats.transacoes || 0,
      },
      {
        name: "boletos",
        url: `/boleto?periodo=${month}`,
        icon: File,
        count: stats.boletos || 0,
      },
      {
        name: "cartões",
        url: "/cartao",
        icon: CreditCard,
        count: stats.cartoes || 0,
      },
      {
        name: "contas",
        url: "/conta",
        icon: PiggyBank,
        count: stats.contas || 0,
      },
      {
        name: "responsáveis",
        url: `/responsavel?periodo=${month}`,
        icon: Users,
      },
      {
        name: "anotações",
        url: `/anotacao?periodo=${month}`,
        icon: Pen,
        count: stats.anotacoes || 0,
      },
    ],
  };
}
