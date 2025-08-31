"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteFaturas(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  const { error } = await supabase.from("faturas").delete().eq("id", excluir);

  if (error) {
    console.error(error);
    return { success: false, message: "Falha ao desfazer pagamento." };
  }

  revalidatePath("/cartao");
  revalidatePath("/dashboard");
  return { success: true, message: "Pagamento desfeito com sucesso." };
}
