import { getClaims } from "@/utils/supabase/claims";

export async function getUserName() {
  const claims = await getClaims();

  if (!claims) {
    return null;
  }

  const firstName = claims?.user_metadata?.first_name ?? "";
  const lastName = claims?.user_metadata?.last_name ?? "";

  // Se não houver nome, retorna null
  if (!firstName && !lastName) {
    return claims?.user_metadata?.name as string | undefined;
  }

  const fullName = `${firstName} ${lastName}`.trim();
  return fullName;
}

export async function getFirstName() {
  const claims = await getClaims();

  if (!claims) {
    return null;
  }
  return (claims.user_metadata as any)?.first_name ?? null;
}

export async function getLastName() {
  const claims = await getClaims();

  if (!claims) {
    return null;
  }
  return (claims.user_metadata as any)?.last_name ?? null;
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
