import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CardHeaderSection from "./sections/header";
import CardTableSection from "./sections/table";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  return (
    <section>
      <MonthPicker />
      <CardHeaderSection id={id} month={month} />

      <CardTableSection id={id} month={month} />
    </section>
  );
}
