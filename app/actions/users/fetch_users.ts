import { getClaims } from "@/utils/supabase/claims";
import { createClient } from "@/utils/supabase/server";

export async function getUserName() {
  const claims = await getClaims();
  if (!claims) return null;

  // 1) fonte primária: profiles.first_name/last_name
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("first_name,last_name")
    .eq("id", claims.id)
    .maybeSingle();
  if (data?.first_name || data?.last_name) {
    const full = [data?.first_name, data?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (full) return full;
  }

  // 2) fallback: token user_metadata.first_name/last_name
  const um = (claims?.user_metadata as any) ?? {};
  const metaFull = [um?.first_name, um?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (metaFull) return metaFull;
  // 3) fallback: token user_metadata.name
  const metaName = um?.name as string | undefined;
  if (metaName) return String(metaName);

  // Fallback final
  return null;
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
