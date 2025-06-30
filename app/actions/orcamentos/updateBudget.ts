"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function parseMoney(value: FormDataEntryValue | null) {
  if (!value) return 0;
  const str = String(value)
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(/,/, ".");
  return parseFloat(str) || 0;
}

export async function updateBudget(prev: unknown, formData: FormData) {
  const supabase = createClient();

  const { id, descricao, valor_orcado, periodo, categoria_id } =
    Object.fromEntries(formData.entries());

  const valor = parseMoney(valor_orcado);

  const { error } = await supabase
    .from("orcamentos")
    .update({ descricao, valor_orcado: valor, periodo, categoria_id })
    .eq("id", id);

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao atualizar orçamento:", error);
    return { message: "Erro ao atualizar orçamento" };
  }
}
