import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import CreateCard from "../modal/create-cards";

export default async function CreateCardSection() {
  const getAccountMap = await getAccount();
  return <CreateCard getAccountMap={getAccountMap} />;
}

