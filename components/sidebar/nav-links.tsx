import {
  ArrowRightLeft,
  CreditCard,
  File,
  LayoutDashboard,
  Pen,
  PiggyBank,
  Users,
} from "lucide-react";

export function getData() {
  return {
    user: {
      name: "Felipe Coutinho",
      email: "m@example.com",
    },

    projects: [
      {
        name: "dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "lançamentos",
        url: "/lancamentos",
        icon: ArrowRightLeft,
      },
      {
        name: "boletos",
        url: "/boleto",
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
        url: "/responsavel",
        icon: Users,
      },
      {
        name: "anotações",
        url: "/anotacao",
        icon: Pen,
      },
    ],
  };
}
