"use client";
import DeleteButton from "@/components/delete-button";
import Utils from "../utils";

export default function DeleteNotes({ itemId }) {
  const { handleDelete, isOpen, setIsOpen, isPending } = Utils();

  return (
    <DeleteButton
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleDelete={handleDelete(itemId)}
      loading={isPending}
    />
  );
}
