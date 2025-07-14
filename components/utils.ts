import { addFaturas } from "@/app/actions/invoices/create_invoices";
import confetti from "canvas-confetti";
import { useTransition } from "react";

export default function Utils() {
  const [isPending, startTransition] = useTransition();

  const handlePaymentInvoices = (e) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target);
      addFaturas(formData).then(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    });
  };

  return {
    handlePaymentInvoices,
    isPending,
    startTransition,
  };
}
