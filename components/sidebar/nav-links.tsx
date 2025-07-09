import {
  RiArrowUpDownFill,
  RiBankCardFill,
  RiBankFill,
  RiBook2Fill,
  RiDashboardFill,
  RiFileList2Fill,
  RiGroupFill,
  RiMoneyDollarCircleFill,
  RiSparkling2Fill,
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
            icon: RiDashboardFill,
          },
        ],
      },
      {
        title: "Gestão Financeira",
        items: [
          {
            name: "lançamentos",
            url: `/lancamentos?periodo=${month}`,
            icon: RiArrowUpDownFill,
          },
          {
            name: "cartões",
            url: "/cartao",
            icon: RiBankCardFill,
          },
          {
            name: "contas",
            url: "/conta",
            icon: RiBankFill,
          },
          {
            name: "limite de gastos",
            url: `/orcamentos`,
            icon: RiMoneyDollarCircleFill,
          },
        ],
      },
      {
        title: "Organização",
        items: [
          {
            name: "responsáveis",
            url: `/responsavel?periodo=${month}`,
            icon: RiGroupFill,
          },
          {
            name: "categorias",
            url: `/categorias`,
            icon: RiFileList2Fill,
          },
        ],
      },
      {
        title: "Análise e Anotações",
        items: [
          {
            name: "anotações",
            url: `/anotacao?periodo=${month}`,
            icon: RiBook2Fill,
          },
          {
            name: "insights",
            url: `/insights?periodo=${month}`,
            icon: RiSparkling2Fill,
          },
        ],
      },
    ],
  };
}
