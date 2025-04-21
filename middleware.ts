import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const protectedRoutes = [
    "/dashboard",
    "/transacao",
    "/cartao",
    "/boleto",
    "/responsaveis",
    "/anotacoes",
    "/contas",
    "/investimentos",
    "/ajustes",
    "/reset-password",
  ];

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
    const {
      data: { user: session },
    } = await supabase.auth.getUser();

    const currentPath = request.nextUrl.pathname;

    // Verifica se a rota atual é "/" ou "/login" e se o usuário está logado
    if (currentPath === "/login" && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Verifica acesso exclusivo para a rota "/investimentos"
    if (
      currentPath === "/investimentos" &&
      session?.user.id !== "3e531380-1b62-4364-914f-f16c44e57272"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Verifica se a rota atual é uma das protegidas
    const isProtectedRoute = protectedRoutes.some(
      (route) =>
        currentPath.startsWith(route) ||
        currentPath.match(/^\/cartao\/\d+\/[a-zA-Z0-9]+$/),
    );

    if (isProtectedRoute && !session) {
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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
