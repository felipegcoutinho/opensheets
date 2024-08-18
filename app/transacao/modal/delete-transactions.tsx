"use client";

import DeleteButton from "@/components/delete-button";
import Utils from "../utils";

export default function DeleteTransactions({ itemId, itemResponsavel }) {
  const { handleDelete, isOpen, setIsOpen } = Utils();

  return <DeleteButton handleDelete={handleDelete(itemId)} itemResponsavel={itemResponsavel} isOpen={isOpen} setIsOpen={setIsOpen} />;
}
