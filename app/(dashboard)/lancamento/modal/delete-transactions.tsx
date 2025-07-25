"use client";

import DeleteButton from "@/components/delete-button";
import UtilitiesLancamento from "../utilities-lancamento";

export default function DeleteTransactions({ itemId, itemResponsavel }) {
  const { handleDelete, isOpen, setIsOpen } = UtilitiesLancamento();

  return (
    <DeleteButton
      handleDelete={handleDelete(itemId)}
      itemResponsavel={itemResponsavel}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
