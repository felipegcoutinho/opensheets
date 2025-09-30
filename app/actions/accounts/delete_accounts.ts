"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/conta/modal/form-schema";

export async function deleteAccount(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  const { error } = await supabase.from("contas").delete().eq("id", excluir);

  revalidatePath("/conta");

  if (error) {
    console.error("Erro ao remover conta:", error);
    return { success: false, message: "Erro ao remover Conta" };
  }

  return { success: true, message: "Conta removida com sucesso!" };
}
