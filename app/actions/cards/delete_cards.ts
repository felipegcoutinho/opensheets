"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "../../(dashboard)/cartao/modal/form-schema";

export async function deleteCards(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");

  const supabase = createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
    return { success: true, message: "Cartão removido!" };
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
    return { success: false, message: "Erro ao remover Cartão" };
  }
}
