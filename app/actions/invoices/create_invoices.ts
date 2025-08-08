"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addFaturas(formData: FormData) {
  const supabase = createClient();

  const { status_pagamento, periodo, cartao_id } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase.from("faturas").insert({
    status_pagamento,
    periodo,
    cartao_id,
  });

  if (error) {
    console.error(error);
    return { success: false, message: "Erro ao adicionar fatura." };
  }

  revalidatePath("/cartao");
  return { success: true, message: "Fatura adicionada com sucesso." };
}
