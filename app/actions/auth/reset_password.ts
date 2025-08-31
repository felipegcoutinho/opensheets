"use server";

import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "@/app/actions/users/update_profile";
import { encodedRedirect } from "@/utils/utils";

export async function sendPasswordResetEmail(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const email = formData.get("email")?.toString().trim();

  if (!email) return { success: false, message: "Informe o e-mail" };

  const supabase = createClient();

  try {
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_TO;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || undefined,
    });
    if (error) {
      console.error(error);
      // Resposta neutra para não vazar existência de conta
      return {
        success: true,
        message: "Se existir uma conta, enviaremos um link de redefinição.",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Não foi possível enviar o e-mail de redefinição",
    };
  }

  return {
    success: true,
    message: "Se existir uma conta, enviaremos um link de redefinição.",
  };
}

export async function sendPasswordResetEmailFromLogin(formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  if (!email) return encodedRedirect("error", "/login", "Informe o e-mail");

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
  // Resposta neutra sempre pela tela de login
  return encodedRedirect(
    "success",
    "/login",
    "Se existir uma conta, enviaremos um link de redefinição.",
  );
}

export async function sendPasswordResetEmailFromReset(formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  if (!email) return encodedRedirect("error", "/login/reset", "Informe o e-mail");

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
