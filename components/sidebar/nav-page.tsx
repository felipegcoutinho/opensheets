import { getEmail, getUserName } from "@/app/actions/users";
import { AppSidebar } from "./app-sidebar";

async function page() {
  const name = await getUserName();
  const email = await getEmail();

  return <AppSidebar usermail={email} username={name} variant="inset" />;
}

export default page;
