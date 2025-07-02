"use client";
import DeleteButton from "@/components/delete-button";
import UtilitiesAnotacao from "../utilities-anotacao";

export default function DeleteNotes({ item }) {
  const { handleDelete, isOpen, setIsOpen, isPending } = UtilitiesAnotacao();

  return (
    <DeleteButton
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleDelete={handleDelete(item.id)}
      loading={isPending}
    />
  );
}
