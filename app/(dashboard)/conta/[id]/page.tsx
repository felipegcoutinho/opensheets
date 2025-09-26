import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import AccountHeaderSection from "./components/header";
import AccountTableSection from "./components/table";
import { getAccountDetails } from "@/app/actions/accounts/fetch_accounts";
import EntityNameSetter from "@/components/entity-name-setter";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });
  const details = await getAccountDetails(id);
  const entityName = details?.descricao ?? null;

  return (
    <div>
      <EntityNameSetter name={entityName} />
      <MonthPicker />
      <AccountHeaderSection id={id} month={month} />

      <AccountTableSection id={id} month={month} />
    </div>
  );
}
