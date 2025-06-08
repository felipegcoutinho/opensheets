import { UseDates } from "@/hooks/use-dates";
import { CheckCircle2Icon } from "@/lib/remix-icons";
import { Separator } from "./ui/separator";
import { RiRecordCircleFill } from "@remixicon/react";

export default function Timeline({
  DataCompra,
  ParcelaAtual,
  DataFim,
  QtdeParcela,
}) {
  const { DateFormat } = UseDates();

  return (
    <div className="rounded-lg px-4">
      <div className="relative">
        {/* Horizontal line */}
        <Separator className="bg-muted absolute top-2 left-0 w-full" />

        <div className="flex w-full justify-between">
          <div className="relative flex flex-col items-center">
            <CheckCircle2Icon className="z-10 mb-2 h-5 w-5" />

            <div className="text-center">
              <h3 className="text-sm font-semibold">Data de Compra</h3>
              <p className="mt-1 text-xs text-gray-500">
                {DateFormat(DataCompra)}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <RiRecordCircleFill className="z-10 mb-2 h-5 w-5 text-orange-500" />
            <div className="text-center">
              <h3 className="text-sm font-semibold">Parcela Atual</h3>
              <p className="mt-1 text-xs text-gray-500">
                {ParcelaAtual} de {QtdeParcela}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <CheckCircle2Icon className="z-10 mb-2 h-5 w-5" color="green" />
            <div className="text-center">
              <h3 className="text-sm font-semibold">Última Parcela</h3>
              <p className="mt-1 text-xs text-gray-500">{DataFim}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
