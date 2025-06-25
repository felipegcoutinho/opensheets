"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("transacoes").delete().eq("id", excluir);
  revalidatePath("/dashboard");
}
