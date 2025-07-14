import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import { getEmail, getUserName } from "@/app/actions/users/fetch_users";
import { AppSidebar } from "./app-sidebar";

async function page() {
  const [name, email, cartoes, contas, categorias] = await Promise.all([
    getUserName(),
    getEmail(),
    getCards(),
    getAccount(),
    getNewCategorias(),
  ]);

  return (
    <AppSidebar
      usermail={email}
      username={name}
      variant="sidebar"
      cartoes={cartoes}
      contas={contas}
      categorias={categorias}
    />
  );
}

export default page;
