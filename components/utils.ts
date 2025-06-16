import { addFaturas } from "@/app/actions/invoices";
import confetti from "canvas-confetti";
import { useTransition } from "react";
import type React from "react";

export default function Utils(): {
  handlePaymentInvoices: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
} {
  const [isPending, startTransition] = useTransition();

  const handlePaymentInvoices = (e: React.FormEvent<HTMLFormElement>): void => {
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
