import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CardHeaderSection from "./sections/header";
import CardTableSection from "./sections/table";
import { getCardDetails } from "@/app/actions/cards/fetch_cards";
import EntityNameSetter from "@/components/entity-name-setter";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });
  const details = await getCardDetails(id);
  const entityName = details?.descricao ?? null;

  return (
    <section>
      <EntityNameSetter name={entityName} />
      <MonthPicker />
      <CardHeaderSection id={id} month={month} />

      <CardTableSection id={id} month={month} />
    </section>
  );
}
