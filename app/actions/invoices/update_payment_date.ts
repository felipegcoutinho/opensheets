"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInvoicePaymentDate(formData: FormData) {
  const id = formData.get("id");
  const created_at = formData.get("created_at");

  if (!id || typeof id !== "string") {
    return { success: false, message: "ID da fatura inválido." };
  }

  const supabase = createClient();

  const value =
    typeof created_at === "string" && created_at.trim()
      ? new Date(`${created_at}T00:00:00.000Z`).toISOString()
      : null;

  const { error } = await supabase
    .from("faturas")
    .update({ created_at: value })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar data de pagamento da fatura:", error);
    return { success: false, message: "Erro ao atualizar data de pagamento." };
  }

  revalidatePath("/cartao");
  revalidatePath("/dashboard");
  return { success: true, message: "Data de pagamento atualizada." };
}

