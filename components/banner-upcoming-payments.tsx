import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { getBills } from "@/app/actions/transactions/fetch_transactions";
import { UseDates } from "@/hooks/use-dates";
import { RiAlarmWarningFill } from "@remixicon/react";
import { differenceInCalendarDays } from "date-fns";
import Banner from "./banner-card";
import { HyperText } from "./magicui/hyper-text";

export default async function UpcomingPaymentsBanner() {
  const { formatted_current_month, optionsMeses } = UseDates();

  const getNextPeriod = (period: string) => {
    const [mes, anoStr] = period.split("-");
    const idx = optionsMeses.findIndex(
      (m) => m.toLowerCase() === mes.toLowerCase(),
    );
    const ano = Number(anoStr);
    const nextIdx = (idx + 1) % 12;
    const nextAno = idx === 11 ? ano + 1 : ano;
    return `${optionsMeses[nextIdx]}-${nextAno}`;
  };

  const nextPeriod = getNextPeriod(formatted_current_month);

  const [billsCurrent, billsNext, invoices] = await Promise.all([
    getBills(formatted_current_month),
    getBills(nextPeriod),
    getInvoiceList(formatted_current_month),
  ]);

  const today = new Date();

  const bills = [...(billsCurrent || []), ...(billsNext || [])];

  const dueBills = bills.filter((bill) => {
    const dueDate = new Date(bill.data_vencimento);
    const diff = differenceInCalendarDays(dueDate, today);
    return diff >= 0 && diff <= 5 && bill.realizado !== true;
  });

  const dueInvoices = invoices.filter((invoice) => {
    const invoiceDue = new Date(today);
    invoiceDue.setDate(Number(invoice.dt_vencimento));
    if (invoiceDue < today) invoiceDue.setMonth(invoiceDue.getMonth() + 1);
    const diff = differenceInCalendarDays(invoiceDue, today);
    return diff >= 0 && diff <= 5 && invoice.status_pagamento !== "pago";
  });

  const totalDue = dueBills.length + dueInvoices.length;

  if (totalDue === 0) return null;

  return (
    <Banner className="bg-orange-50 text-red-700 dark:bg-red-950 dark:text-red-200">
      <div className="flex items-center gap-1 text-left">
        <RiAlarmWarningFill size={16} />
        <p className="text-sm">
          <strong className="font-bold">Atenção!</strong> Você possui {totalDue}{" "}
          pagamento{totalDue > 1 ? "s" : ""} com vencimento nos próximos 5 dias.
        </p>
      </div>
    </Banner>
  );
}
