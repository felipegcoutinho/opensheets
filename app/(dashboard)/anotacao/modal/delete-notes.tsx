"use client";
import DeleteButton from "@/components/delete-button";
import UtilitiesAnotacao from "../utilities-anotacao";

export default function DeleteNotes({ itemId }) {
  const { handleDelete, isOpen, setIsOpen, isPending } = UtilitiesAnotacao();

  return (
    <DeleteButton
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleDelete={handleDelete(itemId)}
      loading={isPending}
    />
  );
}
