import { addFaturas } from "@/app/actions/invoices/create_invoices";
import { payBills } from "@/app/actions/transactions/update_transactions";
import confetti from "canvas-confetti";
import { useTransition } from "react";

export default function UtilitiesComponents() {
  const [isPending, startTransition] = useTransition();

  const handlePaymentInvoices = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    return new Promise((resolve) => {
      startTransition(() => {
        addFaturas(formData).then((response) => {
          if (response.success) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          resolve(response);
        });
      });
    });
  };

  const handlePaymentBills = (id: string, status_pagamento: boolean) => {
    return new Promise((resolve) => {
      startTransition(() => {
        payBills(id, status_pagamento).then((response) => {
          if (response.success) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
          resolve(response);
        });
      });
    });
  };

  return {
    handlePaymentInvoices,
    handlePaymentBills,
    isPending,
    startTransition,
  };
}
