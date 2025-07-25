"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../../(dashboard)/orcamento/modal/form-schema";

export async function deleteBudget(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  const { error } = await supabase
    .from("orcamentos")
    .delete()
    .eq("id", excluir);

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao excluir orçamento:", error);
    return { success: false, message: "Erro ao excluir orçamento" };
  }

  return { success: true, message: "Orçamento removido com sucesso!" };
}
