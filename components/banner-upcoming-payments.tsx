import { getBills } from "@/app/actions/transactions/fetch_transactions";
import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { UseDates } from "@/hooks/use-dates";
import { differenceInCalendarDays } from "date-fns";
import Banner from "./banner-card";
import { RiAlarmWarningFill } from "@remixicon/react";

export default async function UpcomingPaymentsBanner() {
  const { formatted_current_month } = UseDates();

  const [bills, invoices] = await Promise.all([
    getBills(formatted_current_month),
    getInvoiceList(formatted_current_month),
  ]);

  const today = new Date();

  const dueBills = bills.filter((bill) => {
    const dueDate = new Date(bill.data_vencimento);
    const diff = differenceInCalendarDays(dueDate, today);
    return diff >= 0 && diff <= 3 && bill.realizado !== true;
  });

  const dueInvoices = invoices.filter((invoice) => {
    const invoiceDue = new Date(today);
    invoiceDue.setDate(Number(invoice.dt_vencimento));
    if (invoiceDue < today) invoiceDue.setMonth(invoiceDue.getMonth() + 1);
    const diff = differenceInCalendarDays(invoiceDue, today);
    return diff >= 0 && diff <= 3 && invoice.status_pagamento !== "pago";
  });

  const totalDue = dueBills.length + dueInvoices.length;

  if (totalDue === 0) return null;

  return (
    <Banner className="bg-orange-100 text-yellow-800 dark:bg-orange-900/50 dark:text-yellow-200">
      <div className="flex items-center gap-1 text-left">
        <RiAlarmWarningFill size={16} />
        <p className="text-sm">
          <strong className="font-bold">Atenção!</strong> Você possui {totalDue}{" "}
          pagamento{totalDue > 1 ? "s" : ""} com vencimento nos próximos 3 dias.
        </p>
      </div>
    </Banner>
  );
}
