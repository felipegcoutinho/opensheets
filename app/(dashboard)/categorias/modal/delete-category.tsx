"use client";
import DeleteButtonCategoria from "@/components/delete-button-categoria";
import UtilitiesCategoria from "../utilities-categoria";

export default function DeleteCategory({ itemNome, itemId }) {
  const { isOpen, setIsOpen, handleDelete, isPending } = UtilitiesCategoria();

  return (
    <DeleteButtonCategoria
      id={itemId}
      descricao={itemNome}
      handleDelete={handleDelete}
      isPending={isPending}
    />
  );
}
