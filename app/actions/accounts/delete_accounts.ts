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

  try {
    await supabase.from("contas").delete().eq("id", excluir);
    revalidatePath("/conta");
    return { success: true, message: "Conta removida!" };
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    return { success: false, message: "Erro ao remover Conta" };
  }
}
