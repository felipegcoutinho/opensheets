"use server";

import { createClient } from "@/utils/supabase/server";
import { getClaims } from "@/utils/supabase/claims";
import { headers } from "next/headers";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function updateUserName(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const firstName = formData.get("first_name")?.toString().trim();
  const lastName = formData.get("last_name")?.toString().trim();
  if (!firstName || !lastName) {
    return { success: false, message: "Nome inválido" };
  }

  const supabase = createClient();
  const claims = await getClaims();

  if (!claims) {
    return { success: false, message: "Usuário não autenticado" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", claims.id);

  if (error) {
    console.error(error);
    return { success: false, message: "Erro ao atualizar nome" };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { first_name: firstName, last_name: lastName },
  });

  if (authError) {
    console.error(authError);
    return { success: false, message: "Erro ao atualizar usuário" };
  }

  return { success: true, message: "Nome atualizado com sucesso!" };
}

export async function sendPasswordReset(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const email = formData.get("email")?.toString();
  if (!email) {
    return { success: false, message: "Email inválido" };
  }

  const supabase = createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error);
    return { success: false, message: "Erro ao enviar email" };
  }

  return { success: true, message: "Email de redefinição enviado" };
}
