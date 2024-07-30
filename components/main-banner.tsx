import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Card } from "./ui/card";

export default async function Banner() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  const displayName = "Felipe Coutinho";
  if (error) {
    return <p>Erro ao buscar usuário</p>;
  }

  return (
    <Card className="h-32 p-6 bg-violet-100 ring-0 w-full">
      <div className="flex justify-between items-center">
        <div>
          <p>Olá, {displayName}</p>
          <p>{data?.user.id}</p>
          <p>{data?.user.email}</p>
        </div>
      </div>
    </Card>
  );
}
