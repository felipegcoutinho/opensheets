import {
  RiArrowUpDownLine,
  RiBankCardLine,
  RiGovernmentLine,
  RiDashboardLine,
  RiListOrdered,
  RiBook2Line,
  RiGroupLine,
  RiSparkling2Line,
  RiMoneyDollarCircleLine,
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
        name: "orçamento",
        url: `/orcamentos`,
        icon: RiMoneyDollarCircleLine,
      },
    ],
  };
}
