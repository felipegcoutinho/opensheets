"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCards(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
  }
}
