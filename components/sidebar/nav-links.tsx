import {
  RiArrowUpDownLine,
  RiBankCardLine,
  RiBook2Line,
  RiDashboardLine,
  RiGovernmentLine,
  RiGroupLine,
  RiListOrdered,
  RiMoneyDollarCircleLine,
  RiSparkling2Line,
} from "@remixicon/react";

export function NavLinks(month: string) {
  return {
    projects: [
      {
        name: "dashboard",
        url: `/dashboard?periodo=${month}`,
        icon: RiDashboardLine,
      },
      {
        name: "lançamentos",
        url: `/lancamentos?periodo=${month}`,
        icon: RiArrowUpDownLine,
      },
      {
        name: "cartões",
        url: "/cartao",
        icon: RiBankCardLine,
      },
      {
        name: "contas",
        url: "/conta",
        icon: RiGovernmentLine,
      },
      // {
      //   name: "pagadores",
      //   url: `/pagador`,
      //   icon: UserSquare,
      // },
      {
        name: "responsáveis",
        url: `/responsavel?periodo=${month}`,
        icon: RiGroupLine,
      },
      {
        name: "anotações",
        url: `/anotacao?periodo=${month}`,
        icon: RiBook2Line,
      },
      {
        name: "insights",
        url: `/insights?periodo=${month}`,
        icon: RiSparkling2Line,
      },
      {
        name: "categorias",
        url: `/categorias`,
        icon: RiListOrdered,
      },
      {
        name: "limite de gastos",
        url: `/orcamentos`,
        icon: RiMoneyDollarCircleLine,
      },
    ],
  };
}
