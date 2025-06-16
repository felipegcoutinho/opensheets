"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Adiciona uma nova conta bancária
export async function addAccount(formData: FormData): Promise<void> {
  const { descricao, status, tipo_conta, logo_image, anotacao } =
    Object.fromEntries(formData.entries());

  const supabase = createClient();

  try {
    await supabase.from("contas").insert({
      descricao,
      status,
      tipo_conta,
      logo_image,
      anotacao,
    });
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro em adicionar conta:", error);
  }
}

// Deleta uma conta bancária
export async function deleteAccount(formData: FormData): Promise<void> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    await supabase.from("contas").delete().eq("id", excluir);
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
  }
}

// Atualiza uma conta bancária
export async function updateAccount(formData: FormData): Promise<void> {
  const { id, descricao, status, tipo_conta, logo_image, anotacao } =
    Object.fromEntries(formData.entries());

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
      })
      .eq("id", id);
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
  }
}
