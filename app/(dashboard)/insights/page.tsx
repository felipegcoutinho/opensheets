import { getMonth } from "@/hooks/get-month";
import Dashboard from "./dashboard";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);


  return (
    <div>
      <Dashboard month={month} />
    </div>
  );
}
