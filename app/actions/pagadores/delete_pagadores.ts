"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../../(dashboard)/pagador/modal/form-schema";

export async function deletePayer(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  const { error } = await supabase
    .from("pagadores")
    .delete()
    .eq("id", excluir);

  revalidatePath("/pagador");

  if (error) {
    console.error("Erro ao remover pagador:", error);
    return { success: false, message: "Erro ao remover Pagador" };
  }

  return { success: true, message: "Pagador removido com sucesso!" };
}
