import { addFaturas } from "@/app/actions/invoices/create_invoices";
import { payBills } from "@/app/actions/transactions/update_transactions";
import confetti from "canvas-confetti";
import { useTransition } from "react";

type ActionResult = { success: boolean; message?: string };

export default function UtilitiesComponents() {
  const [isPending, startTransition] = useTransition();

  const handlePaymentInvoices = (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<ActionResult> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    return new Promise<ActionResult>((resolve) => {
      startTransition(() => {
        addFaturas(formData).then((response) => {
          if (response.success) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          resolve(response as ActionResult);
        });
      });
    });
  };

  const handlePaymentBills = (
    id: string,
    status_pagamento: boolean,
  ): Promise<ActionResult> => {
    return new Promise<ActionResult>((resolve) => {
      startTransition(() => {
        payBills(id, status_pagamento).then((response) => {
          if (response.success) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
          resolve(response as ActionResult);
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
