import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    url.searchParams.set("error_description", "Código de confirmação ausente.");
    url.pathname = "/auth/confirm";
    return NextResponse.redirect(url);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      url.searchParams.delete("code");
      url.searchParams.set(
        "error_description",
        error.message || "Falha ao validar o link de confirmação.",
      );
      url.pathname = "/auth/confirm";
      return NextResponse.redirect(url);
    }

    // Sucesso: encerra a sessão e redireciona para login com aviso
    await supabase.auth.signOut();
    const loginUrl = new URL(request.url);
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set(
      "success",
      "E-mail confirmado com sucesso! Faça login usando o novo e-mail.",
    );
    return NextResponse.redirect(loginUrl);
  } catch {
    url.searchParams.delete("code");
    url.searchParams.set(
      "error_description",
      "Erro inesperado ao processar a confirmação.",
    );
    url.pathname = "/auth/confirm";
    return NextResponse.redirect(url);
  }
}
