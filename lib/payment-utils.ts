import { differenceInCalendarDays } from "date-fns";

export interface Bill {
  id: string;
  valor: string;
  descricao: string;
  data_vencimento: string;
  dt_pagamento_boleto?: string;
  realizado: boolean;
}

export interface Invoice {
  id: string;
  dt_vencimento: number | string;
  status_pagamento: string;
  [key: string]: any; // Allow for additional properties
}

export interface PaymentInfo {
  dueBills: Bill[];
  dueInvoices: Invoice[];
}

/**
 * Processes bills and invoices to find those due in the next 5 days
 * @param bills Array of bill objects
 * @param invoices Array of invoice objects
 * @param today Reference date (defaults to current date)
 * @returns Object containing bills and invoices due in the next 5 days
 */
export function getUpcomingPayments(
  bills: Bill[] = [],
  invoices: Invoice[] = [],
  today: Date = new Date()
): PaymentInfo {
  const buildUpcomingDateFromDay = (day: number) => {
    const upcoming = new Date(today.getFullYear(), today.getMonth(), day);
    if (upcoming < today) {
      // If the day has already passed this month, check if it's coming up next month
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, day);
      return nextMonth;
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

  // Filter bills due in the next 5 days (including today)
  const dueBills = bills.filter((bill) => {
    const dueDate = new Date(bill.data_vencimento);
    const diff = differenceInCalendarDays(dueDate, today);
    // Only consider bills that are not yet paid and due in the next 5 days (including today)
    return diff >= 0 && diff <= 5 && bill.realizado !== true;
  });

  // Filter invoices due in the next 5 days (including today)
  const dueInvoices = invoices.filter((invoice) => {
    const invoiceDue = parseInvoiceDueDate(invoice.dt_vencimento);
    if (!invoiceDue) return false;
    const diff = differenceInCalendarDays(invoiceDue, today);
    // Only consider invoices that are not yet paid and due in the next 5 days (including today)
    return diff >= 0 && diff <= 5 && invoice.status_pagamento !== "pago";
  });

  return { dueBills, dueInvoices };
}