import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { getBills } from "@/app/actions/transactions/fetch_transactions";
import { UseDates } from "@/hooks/use-dates";
import { RiAlarmWarningFill } from "@remixicon/react";
import { differenceInCalendarDays } from "date-fns";
import Banner from "./banner-card";

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

  const [billsCurrent, billsNext, invoicesCurrent, invoicesNext] =
    await Promise.all([
      getBills(formatted_current_month),
      getBills(nextPeriod),
      getInvoiceList(formatted_current_month),
      getInvoiceList(nextPeriod),
    ]);

  const today = new Date();

  const bills = [...(billsCurrent || []), ...(billsNext || [])];

  const invoices = [
    ...(Array.isArray(invoicesCurrent) ? invoicesCurrent : []),
    ...(Array.isArray(invoicesNext) ? invoicesNext : []),
  ];

  const buildUpcomingDateFromDay = (day: number) => {
    const upcoming = new Date(today.getFullYear(), today.getMonth(), day);
    if (upcoming < today) {
      upcoming.setMonth(upcoming.getMonth() + 1);
    }
    return upcoming;
  };

  const parseInvoiceDueDate = (rawDue: unknown) => {
    if (typeof rawDue === "number") {
      return buildUpcomingDateFromDay(rawDue);
    }

    if (typeof rawDue === "string") {
      const numericDue = Number(rawDue);
      if (!Number.isNaN(numericDue)) {
        return buildUpcomingDateFromDay(numericDue);
      }

      const parsed = new Date(rawDue);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const dueBills = bills.filter((bill) => {
    const dueDate = new Date(bill.data_vencimento);
    const diff = differenceInCalendarDays(dueDate, today);
    return diff >= 0 && diff <= 5 && bill.realizado !== true;
  });

  const dueInvoices = invoices.filter((invoice) => {
    const invoiceDue = parseInvoiceDueDate(invoice.dt_vencimento);
    if (!invoiceDue) return false;
    const diff = differenceInCalendarDays(invoiceDue, today);
    return diff >= 0 && diff <= 5 && invoice.status_pagamento !== "pago";
  });

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
