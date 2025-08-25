import {
  RiArrowUpDownLine,
  RiBankCardLine,
  RiBankLine,
  RiBook2Line,
  RiCalendarLine,
  RiDashboardLine,
  RiFileList2Line,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiSettings2Line,
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
            url: `/lancamento?periodo=${month}`,
            icon: RiArrowUpDownLine,
          },
          {
            name: "calendário",
            url: `/calendario?periodo=${month}`,
            icon: RiCalendarLine,
          },
          {
            name: "cartões",
            url: "/cartao",
            icon: RiBankCardLine,
          },
          {
            name: "contas",
            url: "/conta",
            icon: RiBankLine,
          },
          {
            name: "orçamentos",
            url: `/orcamento?periodo=${month}`,
            icon: RiMoneyDollarCircleLine,
          },
        ],
      },
      {
        title: "Organização",
        items: [
          {
            name: "pagadores",
            url: `/pagador`,
            icon: RiGroupLine,
          },
          {
            name: "categorias",
            url: `/categoria`,
            icon: RiFileList2Line,
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
            url: `/insight?periodo=${month}`,
            icon: RiSparkling2Line,
          },
        ],
      },
      {
        title: "Configurações",
        items: [
          {
            name: "ajustes",
            url: `/ajustes`,
            icon: RiSettings2Line,
          },
        ],
      },
    ],
  };
}
