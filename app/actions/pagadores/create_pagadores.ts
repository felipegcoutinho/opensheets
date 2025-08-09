"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  PayerFormData,
  payerSchema,
} from "../../(dashboard)/pagador/modal/form-schema";

export async function createPayer(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: PayerFormData = {
    nome: String(formData.get("nome")),
    email: String(formData.get("email")),
    status: String(formData.get("status")),
    anotacao: String(formData.get("anotacao")),
  };

  const validated = payerSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  const { error } = await supabase.from("pagadores").insert(validated.data);

  revalidatePath("/pagador");

  if (error) {
    console.error("Erro ao adicionar pagador:", error);
    return { success: false, message: "Erro ao adicionar Pagador" };
  }

  return { success: true, message: "Pagador adicionado com sucesso!" };
}
