import { getAccountDisabled } from "@/app/actions/accounts/fetch_accounts";
import EmptyCard from "@/components/empty-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import UpdateCard from "../modal/update-accounts";
import DeleteAccount from "../modal/delete-accounts";
import PaymentMethodLogo from "../../../../components/payment-method-logo";

export default async function InactiveAccountsSection() {
  const contasInativas = await getAccountDisabled();

  if (!contasInativas?.length) return <EmptyCard />;

  return (
    <div className="grid grid-cols-1 gap-4 saturate-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {contasInativas.map((item) => (
        <Card key={item.id} className="group">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-1">
              <div className="inline-flex items-center justify-center">
                <PaymentMethodLogo
                  url_name={`/logos/${item.logo_image}`}
                  width={42}
                  height={42}
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
              <DeleteAccount itemId={item.id} itemNome={item.descricao} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
