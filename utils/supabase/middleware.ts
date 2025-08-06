import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isProtectedRoute } from "@/lib/auth";

export const updateSession = async (request: NextRequest) => {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    const {
      data: { user: session },
    } = await supabase.auth.getUser();

    const currentPath = request.nextUrl.pathname;

    // Verifica se a rota atual é "/" ou "/login" e se o usuário está logado
    if (currentPath === "/login" && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Verifica se a rota atual é uma das protegidas
    if (isProtectedRoute(currentPath) && !session) {
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
    cookiesToSet.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options),
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
