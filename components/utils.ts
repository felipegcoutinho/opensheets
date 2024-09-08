import { addFaturas } from "@/app/actions/invoices";
import { useTransition } from "react";

export default function Utils() {
  const [isPending, startTransition] = useTransition();

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target); // Utilize o formulário como target
      addFaturas(formData);
    });
  };

  return {
    handleAdd,
    isPending,
    startTransition,
  };
}
