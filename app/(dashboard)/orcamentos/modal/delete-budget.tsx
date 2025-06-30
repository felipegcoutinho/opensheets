"use client";
import DeleteButtonCategoria from "@/components/delete-button-categoria";
import UtilitiesOrcamento from "../utilities-orcamento";

type Props = { itemId: number };

export default function DeleteBudget({ itemId }: Props) {
  const { handleDelete, isPending } = UtilitiesOrcamento();

  return (
    <DeleteButtonCategoria
      id={itemId}
      descricao="orçamento"
      handleDelete={handleDelete}
      isPending={isPending}
    />
  );
}
