import { createClient } from "@/utils/supabase/server";
import { decodeAccessToken, type JwtClaims } from "@/utils/supabase/jwt";

export type AuthClaims = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
  app_metadata?: Record<string, any> | null;
  raw?: JwtClaims;
};

// decodeAccessToken agora é importado de utils/supabase/jwt

// Obtém e normaliza os claims do usuário a partir da sessão atual
export async function getClaims(): Promise<AuthClaims | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  if (!accessToken) return null;

  const claims = decodeAccessToken(accessToken);
  if (!claims?.sub) return null;

  return {
    id: claims.sub,
    email: claims.email ?? null,
    user_metadata: (claims as any).user_metadata ?? null,
    app_metadata: (claims as any).app_metadata ?? null,
    raw: claims,
  };
}
