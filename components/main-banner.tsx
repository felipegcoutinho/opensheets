import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Card } from "./ui/card";

export default async function Banner() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  const displayName = "felipe";
  if (error) {
    return <p>Erro ao buscar usuário</p>;
  }

  return (
    <Card className="h-32 bg-violet-100 ring-0 w-full my-2">
      <div className="flex justify-between items-center">
        <div>
          <p>Olá, {displayName}</p>
          <p>ID</p>
          <p>EMAIL</p>
        </div>
        <div>
          <p className="font-bold text-2xl">Saldo: R$ 2000</p>
        </div>
      </div>
    </Card>
  );
}
