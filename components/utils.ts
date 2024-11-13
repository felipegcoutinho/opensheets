import { addFaturas } from "@actions/invoices";
import { useTransition } from "react";

export default function Utils() {
  const [isPending, startTransition] = useTransition();

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target);
      addFaturas(formData);
    });
  };

  return {
    handleAdd,
    isPending,
    startTransition,
  };
}
