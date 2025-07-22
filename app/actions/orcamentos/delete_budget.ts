"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/orcamentos/modal/form-schema";

export async function deleteBudget(id: number): Promise<ActionResponse> {
  const supabase = createClient();

  const { error } = await supabase.from("orcamentos").delete().eq("id", id);

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao excluir orçamento:", error);
    return { success: false, message: "Erro ao excluir orçamento" };
  }

  return { success: true, message: "Orçamento excluído com sucesso!" };
}
