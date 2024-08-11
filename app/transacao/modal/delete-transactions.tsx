"use client";

import DeleteButton from "@/components/delete-button";
import Utils from "../utils";

export default function DeleteTransactions({ itemId }) {
  const { handleDelete, isOpen, setIsOpen } = Utils();

  return <DeleteButton handleDelete={handleDelete(itemId)} isOpen={isOpen} setIsOpen={setIsOpen} />;
}
