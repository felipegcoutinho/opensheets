import { deleteCategoria } from "@/app/actions/categories";
import { useState } from "react";

export default function CategoryHelper() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (itemId) => async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("excluir", itemId);
    await deleteCategoria(formData);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    handleDelete,
  };
}
