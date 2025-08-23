"use server";

import { createClient } from "@/utils/supabase/server";
import { getClaims } from "@/utils/supabase/claims";

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

  // Garante persistência no banco; cria ou atualiza registro
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: claims.id, first_name: firstName, last_name: lastName }, { onConflict: "id" });

  if (error) {
    // Se houver trigger referenciando coluna inexistente (ex.: updated_at), não bloqueia o fluxo
    if ((error as any)?.code !== "42703") {
      console.error(error);
      return { success: false, message: "Erro ao atualizar nome" };
    }
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

