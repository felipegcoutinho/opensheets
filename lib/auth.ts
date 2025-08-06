export const PROTECTED_ROUTES = [
  "/dashboard",
  "/lancamento",
  "/orcamento",
  "/cartao",
  "/boleto",
  "/responsavel",
  "/anotacao",
  "/conta",
  "/ajuste",
  "/reset-password",
  "/insight",
  "/categoria",
  "/api/descriptions",
  "/api/responsaveis",
  "/api/chat",
] as const;

export const isProtectedRoute = (path: string) =>
  PROTECTED_ROUTES.some(
    (route) => path.startsWith(route) || path.match(/^\/cartao\/\d+\/[a-zA-Z0-9]+$/),
  );
