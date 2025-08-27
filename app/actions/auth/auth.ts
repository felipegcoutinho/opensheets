"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

export async function signOut(data) {
  const supabase = createClient();

  await supabase.auth.signOut();
  return redirect("/login");
}

// Login com e-mail e senha
export const signInWithPassword = async (formData: FormData) => {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const supabase = createClient();

  if (!email || !password) {
    return encodedRedirect("error", "/login", "Informe email e senha.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return encodedRedirect(
      "error",
      "/login",
      "Credenciais inválidas. Verifique seu e-mail e senha.",
    );
  }

  return redirect("/dashboard");
};

// Cadastro com e-mail e senha
export const signUpWithPassword = async (formData: FormData) => {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirm")?.toString();

  if (!name) return encodedRedirect("error", "/login", "Nome é obrigatório.");
  if (!email) return encodedRedirect("error", "/login", "Email é obrigatório.");
  if (!password) return encodedRedirect("error", "/login", "Senha é obrigatória.");
  if (password.length < 6)
    return encodedRedirect(
      "error",
      "/login",
      "A senha deve ter pelo menos 6 caracteres.",
    );
  if (confirm !== undefined && confirm !== password)
    return encodedRedirect("error", "/login", "As senhas não coincidem.");

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/login",
      error.message || "Não foi possível criar sua conta.",
    );
  }

  return encodedRedirect(
    "success",
    "/login",
    "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
  );
};
