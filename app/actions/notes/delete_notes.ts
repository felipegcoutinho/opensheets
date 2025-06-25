"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteNotes(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const excluir = formData.get("excluir");
  const { error } = await supabase.from("anotacoes").delete().eq("id", excluir);

  if (error) {
    console.error("Erro ao excluir anotação:", error);
    return { message: "Erro ao excluir anotação!" };
  }

  if (error) throw error;

  return { message: "Anotação excluída com sucesso!" };

  revalidatePath("/anotacao");
}
