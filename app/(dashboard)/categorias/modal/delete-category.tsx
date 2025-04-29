"use client";

import DeleteButton from "@/components/delete-button";
import CategoryHelper from "../category-helper";

export default function DeleteCategory({ itemId }) {
  const { handleDelete, isOpen, setIsOpen, deleteLoading, isPending } =
    CategoryHelper();

  return (
    <DeleteButton
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleDelete={handleDelete(itemId)}
      loading={isPending}
    />
  );
}
