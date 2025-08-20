import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import {
  getTransactionsForCalendar,
} from "@/app/actions/transactions/fetch_transactions";
import MonthCalendar from "@/components/calendar/month-calendar";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";

export default async function Page(props: {
  searchParams?: { periodo?: string };
}) {
  const month = await getMonth(props);
  const [lancamentos, cartoes, contas, categorias] = await Promise.all([
    getTransactionsForCalendar(month),
    getCards(),
    getAccount(),
    getCategorias(),
  ]);
  return (
    <div className="mb-4 w-full">
      <MonthPicker />
      <MonthCalendar
        month={month}
        lancamentos={lancamentos as any[]}
        getCards={cartoes as any[]}
        getAccount={contas as any[]}
        getCategorias={categorias as any[]}
      />
    </div>
  );
}
