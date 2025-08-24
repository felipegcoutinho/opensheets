import { buildPainelData } from "../utils";
import KpiCards from "../kpi-cards";

export default async function KpisSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return <KpiCards items={data.summary} />;
}

