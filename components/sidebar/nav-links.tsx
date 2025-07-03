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
    groups: [
      {
        title: "Visão Geral",
        items: [
          {
            name: "dashboard",
            url: `/dashboard?periodo=${month}`,
            icon: RiDashboardLine,
          },
        ],
      },
      {
        title: "Gestão Financeira",
        items: [
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
          {
            name: "limite de gastos",
            url: `/orcamentos`,
            icon: RiMoneyDollarCircleLine,
          },
        ],
      },
      {
        title: "Organização",
        items: [
          {
            name: "responsáveis",
            url: `/responsavel?periodo=${month}`,
            icon: RiGroupLine,
          },
          {
            name: "categorias",
            url: `/categorias`,
            icon: RiListOrdered,
          },
        ],
      },
      {
        title: "Análise e Anotações",
        items: [
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
        ],
      },
    ],
  };
}
