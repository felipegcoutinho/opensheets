"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Atualiza uma conta bancária
export async function updateAccount(formData: FormData) {
  const {
    id,
    descricao,
    status,
    tipo_conta,
    logo_image,
    anotacao,
    is_ignored,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();

  try {
    await supabase
      .from("contas")
      .update({
        id,
        descricao,
        status,
        tipo_conta,
        logo_image,
        anotacao,
        is_ignored,
      })
      .eq("id", id);
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
  }
}
