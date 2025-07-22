"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../../(dashboard)/categorias/modal/form-schema";

export async function deleteCategory(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    await supabase.from("categorias").delete().eq("id", excluir);
    revalidatePath("/categorias");
    return { success: true, message: "Categoria removida com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return { success: false, message: "Erro ao remover Categoria" };
  }
}
