import { UseDates } from "@/hooks/use-dates";
import { CircleCheck, CircleEllipsisIcon } from "lucide-react";
import { Separator } from "./ui/separator";

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

        <Separator className="bg-primary absolute top-2 left-0 w-full" />

        <div className="flex w-full justify-between">
          <div className="relative flex flex-col items-center">
            <CircleCheck className="z-10 mb-2 h-5 w-5 fill-neutral-400 text-white" />
            <div className="text-center">
              <h3 className="text-sm font-semibold">Data de Compra</h3>
              <p className="mt-1 text-xs text-gray-500">
                {DateFormat(DataCompra)}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <CircleEllipsisIcon className="z-10 mb-2 h-5 w-5 fill-orange-400 text-white" />
            <div className="text-center">
              <h3 className="text-sm font-semibold">Parcela Atual</h3>
              <p className="mt-1 text-xs text-gray-500">
                {ParcelaAtual} de {QtdeParcela}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <CircleCheck className="z-10 mb-2 h-5 w-5 fill-green-400 text-white" />
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
