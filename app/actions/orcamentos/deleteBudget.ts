"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteBudget(id: number) {
  const supabase = createClient();

  const { error } = await supabase.from("orcamentos").delete().eq("id", id);

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao excluir orçamento:", error);
    return { message: "Erro ao excluir orçamento" };
  }
}
