"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteFaturas(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  const { error } = await supabase.from("faturas").delete().eq("id", excluir);

  if (error) {
    console.error(error);
  }

  revalidatePath("/cartao");
}
