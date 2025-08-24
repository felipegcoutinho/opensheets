"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut(data) {
  const supabase = createClient();

  await supabase.auth.signOut();
  return redirect("/login");
}

export const sendMagicLink = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect("error", "/login", "Email é obrigatório");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error(error);
    return encodedRedirect(
      "error",
      "/login",
      "Não foi possível enviar o magic link",
    );
  }

  return encodedRedirect(
    "success",
    "/login",
    "Enviamos um link de acesso para seu e-mail",
  );
};

export const signInWithGoogle = async () => {
  const supabase = createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/login",
      "Não foi possível iniciar o login com o Google",
    );
  }

  return redirect(data.url);
};

// Removidos: signIn (senha), signup, forgot/reset password
