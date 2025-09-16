import Widget from "@/components/widget";
import { RiStore2Line } from "@remixicon/react";
import TopEstablishmentsWidget from "../top-establishments-widget";
import { buildPainelData } from "../utils";

export default async function TopEstablishmentsSection({
  month,
}: {
  month: string;
}) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Top Estabelecimentos"
      subtitle="Top 10 por estabelecimento"
      information="Agrupa por descrição do lançamento (Você)"
      icon={
        <span className="bg-secondary text-primary mr-2 inline-flex items-center justify-center rounded-md p-1">
          <RiStore2Line className="size-4" />
        </span>
      }
    >
      <TopEstablishmentsWidget items={data.topEstablishments} />
    </Widget>
  );
}

