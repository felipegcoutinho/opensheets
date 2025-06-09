"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CardSchema, CardUpdateSchema } from "@/schema/card-schema";

export async function addCards(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const parsed = CardSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { errors: parsed.error.issues.map((i) => i.message) };
  }

  try {
    await supabase.from("cartoes").insert(parsed.data);
    revalidatePath("/cartao");
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar cartao:", error);
    return { success: false };
  }
}

export async function deleteCards(prevState: unknown, formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
  }
}

export async function updateCards(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const parsed = CardUpdateSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return { errors: parsed.error.issues.map((i) => i.message) };
  }

  const { id, ...data } = parsed.data;

  try {
    await supabase.from("cartoes").update(data).eq("id", id);
    revalidatePath("/cartao");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar cartao:", error);
    return { success: false };
  }
}
