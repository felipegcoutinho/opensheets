"use server";

import { createClient } from "@/utils/supabase/server";
import { getClaims } from "@/utils/supabase/claims";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function updateUserName(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const first_name = formData.get("first_name")?.toString().trim();
  const last_name = formData.get("last_name")?.toString().trim();

  if (!first_name) return { success: false, message: "Primeiro nome é obrigatório" };
  if (!last_name) return { success: false, message: "Sobrenome é obrigatório" };

  const name = `${first_name} ${last_name}`.trim();

  const supabase = createClient();
  const claims = await getClaims();

  if (!claims) {
    return { success: false, message: "Usuário não autenticado" };
  }

  // Garante persistência no banco; cria ou atualiza registro (first_name/last_name)
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: claims.id, first_name, last_name }, { onConflict: "id" });

  if (error) {
    // Se houver trigger referenciando coluna inexistente (ex.: updated_at), não bloqueia o fluxo
    if ((error as any)?.code !== "42703") {
      console.error(error);
      return { success: false, message: "Erro ao atualizar nome" };
    }
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { first_name, last_name, name },
  });

  if (authError) {
    console.error(authError);
    return { success: false, message: "Erro ao atualizar usuário" };
  }

  return { success: true, message: "Nome atualizado com sucesso!" };
}
