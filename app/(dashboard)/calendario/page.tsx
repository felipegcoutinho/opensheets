import { getCards } from "@/app/actions/cards/fetch_cards";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactions } from "@/app/actions/transactions/fetch_transactions";
import MonthPicker from "@/components/month-picker/month-picker";
import MonthCalendar from "@/components/calendar/month-calendar";
import { getMonth } from "@/hooks/get-month";

export default async function Page(props: { searchParams?: { periodo?: string } }) {
  const month = await getMonth(props);
  const [lancamentos, cartoes, contas, categorias] = await Promise.all([
    getTransactions(month),
    getCards(),
    getAccount(),
    getCategorias(),
  ]);

  return (
    <main className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <MonthPicker />
      <MonthCalendar
        month={month}
        lancamentos={lancamentos as any[]}
        getCards={cartoes as any[]}
        getAccount={contas as any[]}
        getCategorias={categorias as any[]}
      />
    </main>
  );
}

