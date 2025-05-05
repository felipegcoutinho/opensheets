"use client";
import CategoryHelper from "../category-helper";
import DeleteButtonCategoria from "@/components/delete-button-categoria";

export default function DeleteCategory({ itemNome, itemId }) {
  const { isOpen, setIsOpen, handleDelete, isPending } = CategoryHelper();

  return (
    <DeleteButtonCategoria
      id={itemId}
      descricao={itemNome}
      handleDelete={handleDelete}
      isPending={isPending}
    />
  );
}
