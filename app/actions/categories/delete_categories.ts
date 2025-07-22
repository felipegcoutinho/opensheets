"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/categorias/modal/form-schema";

export async function deleteCategory(id: number): Promise<ActionResponse> {
  const supabase = createClient();

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao excluir categoria:", error);
    return { success: false, message: "Erro ao excluir categoria!" };
  }

  return { success: true, message: "Categoria excluída com sucesso!" };
}
