import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Apenas estas rotas são públicas; todo o resto requer sessão
  // Inclui também rotas necessárias para o fluxo de auth do Supabase
  const publicPaths = new Set<string>([
    "/", // landing
    "/login", // login (email/senha)
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
    const isPublic = publicPaths.has(currentPath);

    // Usuário já autenticado tentando acessar páginas públicas de auth → redireciona
    if (session && currentPath === "/login") {
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
