import { getClaims } from "@/utils/supabase/claims";
import { createClient } from "@/utils/supabase/server";

export async function getUserName() {
  const claims = await getClaims();
  if (!claims) return null;

  // 1) fonte primária: profiles.name (consistente após update)
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", claims.id)
    .maybeSingle();
  if (data?.name) return String(data.name);

  // 2) fallback: token user_metadata.name
  const metaName = (claims?.user_metadata as any)?.name as string | undefined;
  if (metaName) return metaName;

  // 3) fallback final: nome bruto do provedor (se existir)
  return metaName ?? null;
}

// getFirstName/getLastName removidos após unificar em profiles.name

export async function getEmail() {
  const claims = await getClaims();

  // Se não houver claims, retorna null
  if (!claims) {
    return null;
  }
  return claims.email ?? null;
}

export async function getUserSession() {
  const claims = await getClaims();
  // Mantém compatibilidade: retorna objeto com id/email/user_metadata
  return claims;
}

export async function getAuthProviders(): Promise<string[]> {
  const claims = await getClaims();
  const providers = (claims?.app_metadata as any)?.providers;
  if (Array.isArray(providers)) return providers as string[];
  if (typeof providers === "string") return [providers];
  return [];
}
