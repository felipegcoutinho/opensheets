import ArrowDownUp from "remixicon-react/ArrowUpDownLineIcon";
import CreditCard from "remixicon-react/BankCardLineIcon";
import Landmark from "remixicon-react/BankLineIcon";
import LayoutDashboard from "remixicon-react/DashboardLineIcon";
import ListOrdered from "remixicon-react/ListOrderedIcon";
import NotebookPen from "remixicon-react/FileEditLineIcon";
import Users from "remixicon-react/TeamLineIcon";
import WandSparkles from "remixicon-react/MagicLineIcon";

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
      // {
      //   name: "pagadores",
      //   url: `/pagador`,
      //   icon: UserSquare,
      // },
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
