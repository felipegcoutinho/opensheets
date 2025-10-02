import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { getBills } from "@/app/actions/transactions/fetch_transactions";
import { UseDates } from "@/hooks/use-dates";
import { RiAlarmWarningFill } from "@remixicon/react";
import Banner from "./banner-card";
import { getUpcomingPayments } from "@/lib/payment-utils";

export default async function UpcomingPaymentsBanner() {
  const { formatted_current_month } = UseDates();
  const today = new Date();

  // Fetch data for the current month
  const [bills, invoices] = await Promise.all([
    getBills(formatted_current_month),
    getInvoiceList(formatted_current_month),
  ]);

  // Process payments to find upcoming ones
  const { dueBills, dueInvoices } = getUpcomingPayments(bills, invoices, today);

  const totalDue = dueBills.length + dueInvoices.length;

  if (totalDue === 0) return null;

  return (
    <Banner className="bg-primary/10">
      <div className="flex items-center gap-2 text-left">
        <span className="text-expense inline-flex items-center justify-center">
          <RiAlarmWarningFill size={20} color="red" />
        </span>
        <span className="text-sm">
          <strong>Atenção!</strong> Você possui{" "}
          <strong>
            {totalDue} pagamento{totalDue > 1 ? "s" : ""}
          </strong>{" "}
          com vencimento nos próximos <strong>5 dias.</strong>
        </span>
      </div>
    </Banner>
  );
}
