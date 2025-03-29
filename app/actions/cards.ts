"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Adiciona um novo cartão
export async function addCards(formData: FormData) {
  const {
    descricao,
    dt_vencimento,
    dt_fechamento,
    anotacao,
    limite,
    bandeira,
    logo_image,
    tipo,
    status,
    conta_id,
  } = Object.fromEntries(formData.entries());

  const supabase = await createClient();

  try {
    await supabase.from("cartoes").insert({
      descricao,
      dt_vencimento,
      dt_fechamento,
      anotacao,
      limite,
      bandeira,
      logo_image,
      tipo,
      status,
      conta_id,
    });
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao adicionar cartao:", error);
  }
}

// Deleta um cartão
export async function deleteCards(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = await createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
  }
}

// Atualiza um cartão
export async function updateCards(formData: FormData) {
  const {
    id,
    descricao,
    dt_vencimento,
    dt_fechamento,
    anotacao,
    limite,
    bandeira,
    logo_image,
    tipo,
    status,
    conta_id,
  } = Object.fromEntries(formData.entries());

  const supabase = await createClient();

  try {
    await supabase
      .from("cartoes")
      .update({
        id,
        descricao,
        dt_vencimento,
        dt_fechamento,
        anotacao,
        limite,
        bandeira,
        logo_image,
        tipo,
        status,
        conta_id,
      })
      .eq("id", id);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao atualizar cartao:", error);
  }
}
