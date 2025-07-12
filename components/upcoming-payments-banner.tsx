import { getBills } from "@/app/actions/transactions/fetch_transactions";
import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";
import { RiAlarmWarningFill } from "@remixicon/react";

export default async function UpcomingPaymentsBanner() {
  const { formatted_current_month } = UseDates();

  const [bills, invoices] = await Promise.all([
    getBills(formatted_current_month),
    getInvoiceList(formatted_current_month),
  ]);

  const today = new Date().getDate();
  const limitDay = today + 3;

  const dueBills = bills.filter((bill) => {
    const dueDay = new Date(bill.data_vencimento).getDate();
    return dueDay >= today && dueDay <= limitDay;
  });

  const dueInvoices = invoices.filter((invoice) => {
    const dueDay = Number(invoice.dt_vencimento);
    return dueDay >= today && dueDay <= limitDay;
  });

  const totalDue = dueBills.length + dueInvoices.length;

  if (totalDue === 0) return null;

  return (
    <Banner
      className={
        "bg-orange-100 text-yellow-900 dark:bg-orange-800 dark:text-yellow-200"
      }
    >
      <div className="flex items-center gap-1 text-left text-sm">
        <p>
          <RiAlarmWarningFill size={18} />
        </p>
        <p>
          <strong className="font-bold">Atenção!</strong> Você possui {totalDue}{" "}
          conta(s) com vencimento nos próximos 3 dias.
        </p>
      </div>
    </Banner>
  );
}
