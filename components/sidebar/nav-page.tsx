import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getEmail, getUserName } from "@/app/actions/users/fetch_users";
import { getPrincipalPayer } from "@/app/actions/pagadores/fetch_pagadores";
import { AppSidebar } from "./app-sidebar";

async function page() {
  const [name, email, cartoes, contas, categorias, principal] = await Promise.all([
    getUserName(),
    getEmail(),
    getCards(),
    getAccount(),
    getCategorias(),
    getPrincipalPayer(),
  ]);

  return (
    <AppSidebar
      usermail={email}
      username={name}
      payerPrincipal={principal}
      variant="sidebar"
      cartoes={cartoes}
      contas={contas}
      categorias={categorias}
    />
  );
}

export default page;
