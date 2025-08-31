import { getAccountDisabled } from "@/app/actions/accounts/fetch_accounts";
import EmptyCard from "@/components/empty-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import UpdateCard from "../modal/update-accounts";

export default async function InactiveAccountsSection() {
  const contasInativas = await getAccountDisabled();

  if (!contasInativas?.length) return <EmptyCard />;

  return (
    <div className="grid grid-cols-1 gap-4 saturate-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {contasInativas.map((item) => (
        <Card key={item.id} className="group">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              <div className="bg-secondary text-primary inline-flex size-9 items-center justify-center rounded-md overflow-hidden">
                <Image
                  src={`/logos/${item.logo_image}`}
                  alt={item.descricao}
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <CardTitle className="capitalize">
                <Link href={`/conta/${item.id}`} className="hover:underline">
                  {item.descricao}
                </Link>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mt-6 flex items-center gap-3">
              <Button asChild variant="link" size="sm">
                <Link href={`/conta/${item.id}`}>extrato</Link>
              </Button>
              <UpdateCard item={item} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
