"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Deleta uma conta bancária
export async function deleteAccount(formData: FormData) {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    await supabase.from("contas").delete().eq("id", excluir);
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
  }
}
