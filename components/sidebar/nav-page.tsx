import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getEmail, getUserName } from "@/app/actions/users/fetch_users";
import { getPrincipalPayer } from "@/app/actions/pagadores/fetch_pagadores";
import { AppSidebar } from "./app-sidebar";
import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";

async function page() {
  const [
    name,
    email,
    cartoes,
    contas,
    categorias,
    principal,
    budgetRule,
  ] = await Promise.all([
    getUserName(),
    getEmail(),
    getCards(),
    getAccount(),
    getCategorias(),
    getPrincipalPayer(),
    getBudgetRule(),
  ]);

  return (
    <AppSidebar
      usermail={email ?? ""}
      username={name ?? ""}
      payerPrincipal={principal}
      variant="sidebar"
      cartoes={cartoes}
      contas={contas}
      categorias={categorias}
      budgetRule={budgetRule}
    />
  );
}

export default page;
