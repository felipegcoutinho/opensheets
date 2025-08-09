"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  PayerFormData,
  payerSchema,
} from "../../(dashboard)/pagador/modal/form-schema";

export async function updatePayer(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: PayerFormData = {
    id: String(formData.get("id")),
    nome: String(formData.get("nome")),
    email: String(formData.get("email")),
    status: String(formData.get("status")),
    anotacao: String(formData.get("anotacao")),
  };

  const validated = payerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("pagadores")
    .update({
      nome: validated.data.nome,
      email: validated.data.email,
      status: validated.data.status,
      anotacao: validated.data.anotacao,
    })
    .eq("id", validated.data.id);

  revalidatePath("/pagador");

  if (error) {
    console.error("Erro ao atualizar pagador:", error);
    return { success: false, message: "Erro ao atualizar Pagador" };
  }

  return { success: true, message: "Pagador atualizado com sucesso!" };
}
