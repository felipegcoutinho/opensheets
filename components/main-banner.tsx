import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Teste from "./teste";

export default async function Banner() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  const displayName = "Felipe Coutinho";
  if (error) {
    return <p>Erro ao buscar usuário</p>;
  }

  return (
    <Teste>
      <div>
        <p>Olá, {displayName}</p>
        <p>{data?.user.id}</p>
        <p>{data?.user.email}</p>
      </div>
    </Teste>
  );
}
