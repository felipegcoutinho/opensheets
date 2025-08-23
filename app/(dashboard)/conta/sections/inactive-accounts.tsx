import { getAccountDisabled } from "@/app/actions/accounts/fetch_accounts";
import EmptyCard from "@/components/empty-card";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpdateCard from "../modal/update-accounts";

export default async function InactiveAccountsSection() {
  const contasInativas = await getAccountDisabled();

  if (!contasInativas?.length) return <EmptyCard />;

  return (
    <div className="grid gap-4 saturate-0 lg:grid-cols-3">
      {contasInativas.map((item) => (
        <Card key={item.id} className="p-2">
          <CardContent className="space-y-4 p-4">
            <CardTitle className="flex items-center justify-between">
              <PaymentMethodLogo
                url_name={`/logos/${item.logo_image}`}
                descricao={item.descricao}
                width={50}
                height={50}
              />
            </CardTitle>
          </CardContent>

          <CardFooter className="flex justify-between px-4">
            <Button className="p-0" variant="link">
              <Link href={`/conta/${item.id}`}>extrato</Link>
            </Button>

            <UpdateCard item={item} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

