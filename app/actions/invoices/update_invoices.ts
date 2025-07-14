"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateFaturas(formData: FormData) {
  const { id, status_pagamento } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  const { error } = await supabase
    .from("faturas")
    .update({ id, status_pagamento })
    .eq("id", id);

  if (error) {
    console.error(error);
  }

  revalidatePath("/cartao");
}
