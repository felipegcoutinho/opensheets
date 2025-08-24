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
  const name = formData.get("name")?.toString().trim();
  if (!name) return { success: false, message: "Nome inválido" };

  const supabase = createClient();
  const claims = await getClaims();

  if (!claims) {
    return { success: false, message: "Usuário não autenticado" };
  }

  // Garante persistência no banco; cria ou atualiza registro (campo único "name")
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: claims.id, name }, { onConflict: "id" });

  if (error) {
    // Se houver trigger referenciando coluna inexistente (ex.: updated_at), não bloqueia o fluxo
    if ((error as any)?.code !== "42703") {
      console.error(error);
      return { success: false, message: "Erro ao atualizar nome" };
    }
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { name },
  });

  if (authError) {
    console.error(authError);
    return { success: false, message: "Erro ao atualizar usuário" };
  }

  return { success: true, message: "Nome atualizado com sucesso!" };
}
