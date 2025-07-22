"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function parseMoney(value: FormDataEntryValue | null) {
  if (!value) return 0;
  const str = String(value)
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(/,/, ".");
  return parseFloat(str) || 0;
}

export async function updateCard(prev: unknown, formData: FormData) {
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

  const supabase = createClient();
  const limiteValue = parseMoney(limite);

  const { error } = await supabase
    .from("cartoes")
    .update({
      id,
      descricao,
      dt_vencimento,
      dt_fechamento,
      anotacao,
      limite: limiteValue,
      bandeira,
      logo_image,
      tipo,
      status,
      conta_id,
    })
    .eq("id", id);

  revalidatePath("/cartao");

  if (error) {
    console.error("Erro ao atualizar cartao:", error);
    return { message: "Erro ao atualizar Cartão" };
  }

  return { message: "Cartão atualizado com sucesso" };
}
