"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../../(dashboard)/categoria/modal/form-schema";

export async function deleteCategory(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  const { error } = await supabase.from("categorias").delete().eq("id", excluir);

  revalidatePath("/categoria");

  if (error) {
    console.error("Erro ao remover categoria:", error);
    return { success: false, message: "Erro ao remover Categoria" };
  }

  return { success: true, message: "Categoria removida com sucesso!" };
}
