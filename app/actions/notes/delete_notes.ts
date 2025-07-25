"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/anotacao/modal/form-schema";

export async function deleteNote(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    await supabase.from("anotacoes").delete().eq("id", excluir);
    revalidatePath("/anotacao");
    return { success: true, message: "Anotação excluída com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir anotação:", error);
    return { success: false, message: "Erro ao excluir anotação!" };
  }
}
