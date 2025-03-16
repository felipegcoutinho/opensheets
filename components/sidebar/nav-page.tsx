import { getEmail, getUserName } from "@/app/actions/users";
import { AppSidebar } from "./app-sidebar";

async function NavPage() {
  const name = await getUserName();
  const email = await getEmail();

  return <AppSidebar usermail={email} username={name} variant="sidebar" />;
}

export default NavPage;
