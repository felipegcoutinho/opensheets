"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  CardFormSchema,
  UpdateCardFormSchema,
  cardFormSchema,
  updateCardFormSchema,
} from "../(dashboard)/cartao/modal/form-schema";

export async function addCards(
  prevState: ActionResponse<CardFormSchema> | null,
  formData: FormData,
): Promise<ActionResponse<CardFormSchema>> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = cardFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inv\xE1lidos",
      errors: parsed.error.flatten().fieldErrors,
      inputs: raw as CardFormSchema,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("cartoes").insert({
    descricao: parsed.data.descricao,
    dt_vencimento: parsed.data.dt_vencimento.toString(),
    dt_fechamento: parsed.data.dt_fechamento.toString(),
    anotacao: parsed.data.anotacao,
    limite: parsed.data.limite.replace(/[R$\.\s]/g, "").replace(",", "."),
    bandeira: parsed.data.bandeira,
    logo_image: parsed.data.logo_image,
    tipo: parsed.data.tipo,
    status: parsed.data.status,
    conta_id: Number(parsed.data.conta_id),
  });

  if (error) {
    console.error("Erro ao adicionar cartao:", error);
    return { success: false, message: "Erro ao adicionar cart\xE3o" };
  }

  revalidatePath("/cartao");
  return { success: true, message: "Cart\xE3o adicionado com sucesso!" };
}

export async function deleteCards(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
  }
}

export async function updateCards(
  prevState: ActionResponse<UpdateCardFormSchema> | null,
  formData: FormData,
): Promise<ActionResponse<UpdateCardFormSchema>> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateCardFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inv\xE1lidos",
      errors: parsed.error.flatten().fieldErrors,
      inputs: raw as UpdateCardFormSchema,
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("cartoes")
    .update({
      descricao: parsed.data.descricao,
      dt_vencimento: parsed.data.dt_vencimento.toString(),
      dt_fechamento: parsed.data.dt_fechamento.toString(),
      anotacao: parsed.data.anotacao,
      limite: parsed.data.limite.replace(/[R$\.\s]/g, "").replace(",", "."),
      bandeira: parsed.data.bandeira,
      logo_image: parsed.data.logo_image,
      tipo: parsed.data.tipo,
      status: parsed.data.status,
      conta_id: Number(parsed.data.conta_id),
    })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("Erro ao atualizar cartao:", error);
    return { success: false, message: "Erro ao atualizar cart\xE3o" };
  }

  revalidatePath("/cartao");
  return { success: true, message: "Cart\xE3o atualizado com sucesso!" };
}
