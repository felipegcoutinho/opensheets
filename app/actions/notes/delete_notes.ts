"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/anotacao/modal/form-schema";

export async function deleteNote(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  const { error } = await supabase.from("anotacoes").delete().eq("id", excluir);

  revalidatePath("/anotacao");

  if (error) {
    console.error("Erro ao excluir anotação:", error);
    return { success: false, message: "Erro ao excluir anotação!" };
  }

  return { success: true, message: "Anotação excluída com sucesso!" };
}
