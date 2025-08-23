import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Após autenticar, garante que o perfil exista e, se possível, com nome preenchido
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (user?.id) {
        const meta: any = user.user_metadata || {};
        // Tenta capturar nome do provedor (Google etc.)
        const given = meta.first_name || meta.given_name || "";
        const family = meta.last_name || meta.family_name || "";
        let firstName = String(given || "");
        let lastName = String(family || "");
        if ((!firstName || !lastName) && typeof meta.name === "string") {
          const parts = meta.name.trim().split(/\s+/);
          if (parts.length > 1) {
            firstName = firstName || parts[0];
            lastName = lastName || parts.slice(1).join(" ");
          } else if (parts.length === 1) {
            firstName = firstName || parts[0];
          }
        }

        // Garante existência do registro na tabela profiles
        await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              email: user.email,
              first_name: firstName || null,
              last_name: lastName || null,
            },
            { onConflict: "id" },
          );
      }
    } catch (e) {
      // Não bloqueia o fluxo de login em caso de erro no upsert de profile
      console.error("profile upsert error", e);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}
