import { payBills } from "@/app/actions/bills";
import { addFaturas } from "@/app/actions/invoices";
import confetti from "canvas-confetti";
import { useTransition } from "react";

export default function Utils() {
  const [isPending, startTransition] = useTransition();

  const handlePaymentInvoices = (e) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target);
      addFaturas(formData).then(() => {
        // Executar confetti ao finalizar o pagamento
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    });
  };

  const handlePaymentBills = (e) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target);
      payBills(formData, id).then(() => {
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
    handlePaymentBills,
    isPending,
    startTransition,
  };
}
