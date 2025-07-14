"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Adiciona uma nova conta bancária
export async function addAccount(formData: FormData) {
  const { descricao, status, tipo_conta, logo_image, anotacao, is_ignored } =
    Object.fromEntries(formData.entries());

  const supabase = createClient();

  try {
    await supabase.from("contas").insert({
      descricao,
      status,
      tipo_conta,
      logo_image,
      anotacao,
      is_ignored,
    });
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro em adicionar conta:", error);
  }
}
