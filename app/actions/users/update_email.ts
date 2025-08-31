"use server";

import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "./update_profile";

export async function updateUserEmail(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const email = formData.get("email")?.toString().trim();
  const confirm = formData.get("confirm")?.toString().trim();

  if (!email) return { success: false, message: "Email é obrigatório" };
  if (!confirm) return { success: false, message: "Confirmação de e-mail é obrigatória" };
  if (email.toLowerCase() !== confirm.toLowerCase())
    return { success: false, message: "Os e-mails não coincidem" };

  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Não foi possível atualizar o e-mail",
    };
  }

  return {
    success: true,
    message:
      "Enviamos os links de confirmação. Confirme no novo e também no e-mail atual (quando aplicável) para concluir a alteração.",
  };
}
