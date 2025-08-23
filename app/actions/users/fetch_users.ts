import { getClaims } from "@/utils/supabase/claims";
import { createClient } from "@/utils/supabase/server";

export async function getUserName() {
  const claims = await getClaims();
  if (!claims) return null;

  // 1) fonte primária: profiles (consistente após update)
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", claims.id)
    .maybeSingle();
  if (data?.first_name || data?.last_name) {
    return `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();
  }

  // 2) fallback: token user_metadata
  const metaFirst = claims?.user_metadata?.first_name ?? "";
  const metaLast = claims?.user_metadata?.last_name ?? "";
  if (metaFirst || metaLast) return `${metaFirst} ${metaLast}`.trim();

  // 3) fallback final: nome bruto do provedor (se existir)
  return (claims?.user_metadata as any)?.name as string | undefined;
}

export async function getFirstName() {
  const claims = await getClaims();
  if (!claims) return null;
  // 1) profiles
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", claims.id)
    .maybeSingle();
  if ((data as any)?.first_name) return (data as any).first_name as string;
  // 2) token
  const metaFirst = (claims.user_metadata as any)?.first_name ?? null;
  if (metaFirst) return metaFirst;
  const rawName = (claims.user_metadata as any)?.name as string | undefined;
  if (rawName && typeof rawName === "string") {
    const parts = rawName.trim().split(/\s+/);
    if (parts.length) return parts[0];
  }
  return null;
}

export async function getLastName() {
  const claims = await getClaims();
  if (!claims) return null;
  // 1) profiles
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("last_name")
    .eq("id", claims.id)
    .maybeSingle();
  if ((data as any)?.last_name) return (data as any).last_name as string;
  // 2) token
  const metaLast = (claims.user_metadata as any)?.last_name ?? null;
  if (metaLast) return metaLast;
  const rawName = (claims.user_metadata as any)?.name as string | undefined;
  if (rawName && typeof rawName === "string") {
    const parts = rawName.trim().split(/\s+/);
    if (parts.length > 1) return parts.slice(1).join(" ");
  }
  return null;
}

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
