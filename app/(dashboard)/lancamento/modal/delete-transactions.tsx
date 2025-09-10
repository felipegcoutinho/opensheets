"use client";

import DeleteButton from "@/components/delete-button";
import UtilitiesLancamento from "../utilities-lancamento";

export default function DeleteTransactions({ itemId }) {
  const { handleDelete, isOpen, setIsOpen } = UtilitiesLancamento();

  return (
    <DeleteButton
      handleDelete={handleDelete(itemId)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
