import { getEmail, getUserName } from "@/app/actions/users";
import { getCards } from "@/app/services/cartoes";
import { getNewCategorias } from "@/app/services/categorias";
import { getAccount } from "@/app/services/contas";
import { AppSidebar } from "./app-sidebar";

async function page() {
  const name = await getUserName();
  const email = await getEmail();

  const cartoes = await getCards();
  const contas = await getAccount();
  const getCategorias = await getNewCategorias();

  return (
    <AppSidebar
      usermail={email}
      username={name}
      variant="sidebar"
      cartoes={cartoes}
      contas={contas}
      categorias={getCategorias}
    />
  );
}

export default page;
