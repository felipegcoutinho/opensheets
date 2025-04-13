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
  }

  revalidatePath("/cartao");
}

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

export async function deleteFaturas(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  const { error } = await supabase.from("faturas").delete().eq("id", excluir);

  if (error) {
    console.error(error);
  }

  revalidatePath("/cartao");
}
