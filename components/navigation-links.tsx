// app/config/menu-config.js
"use client";

import {
  ArrowDownUpIcon,
  BadgeCentIcon,
  CreditCard,
  File,
  Home,
  Landmark,
  NotebookPenIcon,
  Users,
} from "lucide-react";

export function NavigationLinks({ month, userEmail }) {
  const links = [
    {
      href: `/dashboard?periodo=${month}`,
      Icon: Home,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      href: `/dashboard/transacao?periodo=${month}`,
      Icon: ArrowDownUpIcon,
      name: "Transações",
      path: "/dashboard/transacao",
    },
    {
      href: `/dashboard/boleto?periodo=${month}`,
      Icon: File,
      name: "Boletos",
      path: "/dashboard/boleto",
    },
    {
      href: `/dashboard/cartao`,
      Icon: CreditCard,
      name: "Cartões",
      path: "/dashboard/cartao",
    },
    {
      href: `/dashboard/conta`,
      Icon: Landmark,
      name: "Contas",
      path: "/dashboard/conta",
    },
    {
      href: `/dashboard/responsavel?periodo=${month}`,
      Icon: Users,
      name: "Responsáveis",
      path: "/dashboard/responsavel",
    },
    {
      href: `/dashboard/anotacao?periodo=${month}`,
      Icon: NotebookPenIcon,
      name: "Anotações",
      path: "/dashboard/anotacao",
    },
  ];

  // Adiciona o link de investimentos apenas para um usuário específico
  if (userEmail === "coutinho@outlook.com") {
    links.push({
      href: `/dashboard/investimentos`,
      Icon: BadgeCentIcon,
      name: "Investimentos",
      path: "/investimentos",
    });
  }

  return links;
}

export default NavigationLinks;
