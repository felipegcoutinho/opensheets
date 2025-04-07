import { getEmail, getUserName } from "@/app/actions/users";
import { getPeriodo } from "@/hooks/periodo";
import { getNotesStats } from "@/services/anotacoes";
import { getBillsStats } from "@/services/boletos";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import { getTransactionsStats } from "@/services/transacoes";
import { AppSidebar } from "./app-sidebar";

async function NavPage(props) {
  const name = await getUserName();
  const email = await getEmail();
  const month = await getPeriodo(props);

  const statsData = await Promise.all([
    getTransactionsStats(month),
    getBillsStats(month),
    getCardsStats(),
    getAccountsStats(),
    getNotesStats(month),
  ]);

  console.log("month", month);

  const [transactionsStats, billsStats, cardsStats, accountsStats, notesStats] =
    statsData;

  return (
    <AppSidebar
      usermail={email}
      username={name}
      stats={{
        transacoes: transactionsStats,
        boletos: billsStats,
        cartoes: cardsStats,
        contas: accountsStats,
        anotacoes: notesStats,
      }}
      variant="inset"
    />
  );
}

export default NavPage;
