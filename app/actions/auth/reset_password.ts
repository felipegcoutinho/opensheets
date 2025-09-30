"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export async function sendPasswordResetEmailFromReset(formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  if (!email)
    return encodedRedirect("error", "/login/reset", "Informe o e-mail");

  const supabase = createClient();
  try {
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_TO;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || undefined,
    });
    if (error) {
      console.error(error);
    }
  } catch (e) {
    console.error(e);
  }
  return encodedRedirect(
    "success",
    "/login/reset",
    "Solicitação realizada com sucesso!\nVerifique seu email. Você receberá um email com instruções de recuperação de senha.",
  );
}
