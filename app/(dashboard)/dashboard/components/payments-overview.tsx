import Widget from "@/components/widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiWalletLine } from "@remixicon/react";
import { PaymentWidget } from "../payment-widget";
import { ConditionWidget } from "../condition-widget";
import { buildPainelData } from "../utils";

export default async function PaymentsOverviewSection({
  month,
}: {
  month: string;
}) {
  const data = await buildPainelData(month);

  return (
    <Widget
      title="Pagamentos"
      subtitle={`Formas e condições no período`}
      information="Considera os lançamentos do usuário no mês selecionado."
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiWalletLine className="size-4" />
        </span>
      }
    >
      <Tabs defaultValue="formas" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="formas">Formas de Pagamento</TabsTrigger>
          <TabsTrigger value="condicoes">Condições de Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="formas" className="mt-4 space-y-2">
          <PaymentWidget month={data.month} data={data.payment} />
        </TabsContent>

        <TabsContent value="condicoes" className="mt-4 space-y-2">
          <ConditionWidget month={data.month} data={data.conditions} />
        </TabsContent>
      </Tabs>
    </Widget>
  );
}
