"use server";

import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "./update_profile";

export async function updateUserPassword(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirm")?.toString();

  if (!password) return { success: false, message: "Senha é obrigatória" };
  if (!confirm) return { success: false, message: "Confirmação de senha é obrigatória" };
  if (password !== confirm)
    return { success: false, message: "As senhas não coincidem" };
  if (password.length < 6)
    return {
      success: false,
      message: "A senha deve ter pelo menos 6 caracteres",
    };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Não foi possível atualizar a senha",
    };
  }

  return { success: true, message: "Senha atualizada com sucesso!" };
}

