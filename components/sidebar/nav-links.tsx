import {
  ArrowRightLeft,
  CreditCard,
  File,
  LayoutDashboard,
  Pen,
  PiggyBank,
  Users,
} from "lucide-react";

export function NavLinks(month: string) {
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
      },
      {
        name: "boletos",
        url: `/boleto?periodo=${month}`,
        icon: File,
      },
      {
        name: "cartões",
        url: "/cartao",
        icon: CreditCard,
      },
      {
        name: "contas",
        url: "/conta",
        icon: PiggyBank,
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
      },
      // {
      //   name: "insights",
      //   url: `/insights?periodo=${month}`,
      //   icon: Lightbulb,
      // },
    ],
  };
}
