"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInvest() {
  const supabase = createClient();
  const { data } = await supabase.from("investimentos").select(`id, data, valor`).order("data", { ascending: true });

  return data;
}

export async function addInvest(formData: FormData) {
  const { data, valor } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  await supabase.from("investimentos").insert({ data, valor });

  revalidatePath("/investimentos");
}

export async function deleteInvest(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("investimentos").delete().eq("id", excluir);

  revalidatePath("/investimentos");
}

export async function updateInvest(formData: FormData) {
  const { id, data, valor } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  await supabase.from("investimentos").update({ id, data, valor }).eq("id", id);

  revalidatePath("/investimentos");
}
