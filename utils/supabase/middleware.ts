import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Normaliza removendo a barra final (exceto para a raiz '/')
  const normalize = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);

  // Rotas públicas; o restante requer sessão
  const publicPaths = new Set<string>([
    "/", // tela de login padrão
    "/login",
    "/login/signup",
    "/login/reset",
    "/login/reset/update",
    "/auth/confirm", // página pública para confirmar fluxos de e-mail/código
    "/auth/confirm/complete",
  ]);

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
          },
        },
      },
    );

    // Obtém a sessão do usuário
    const { data } = await supabase.auth.getClaims();
    const session = data?.claims;

    const currentPath = request.nextUrl.pathname;
    const normalizedPath = normalize(currentPath);
    const isPublic = publicPaths.has(normalizedPath);
    const isAuthEntry = normalizedPath === "/" || normalizedPath === "/login";

    // Usuário já autenticado tentando acessar páginas públicas de auth → redireciona
    if (session && isAuthEntry) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Qualquer rota não pública sem sessão → redireciona para /login
    if (!isPublic && !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Se a sessão existir ou a rota não estiver protegida, continua a execução normal
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Atualiza os cookies no response
    const cookiesToSet = request.cookies.getAll();
    cookiesToSet.forEach(({ name, value }) =>
      response.cookies.set(name, value),
    );

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
