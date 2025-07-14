"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

  const supabase = createClient();

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
