import {
  ArrowDownUp,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  NotebookPen,
  Landmark,
  Users,
  WandSparkles,
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
        icon: ArrowDownUp,
      },
      {
        name: "cartões",
        url: "/cartao",
        icon: CreditCard,
      },
      {
        name: "contas",
        url: "/conta",
        icon: Landmark,
      },
      {
        name: "responsáveis",
        url: `/responsavel?periodo=${month}`,
        icon: Users,
      },
      {
        name: "anotações",
        url: `/anotacao?periodo=${month}`,
        icon: NotebookPen,
      },
      {
        name: "insights",
        url: `/insights?periodo=${month}`,
        icon: WandSparkles,
      },
      {
        name: "categorias",
        url: `/categorias`,
        icon: ListOrdered,
      },
    ],
  };
}
