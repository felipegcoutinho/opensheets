import { UseDates } from "@/hooks/use-dates";
import { CircleCheck, CircleEllipsisIcon } from "lucide-react";

export default function Timeline({ DataCompra, ParcelaAtual, DataFim, QtdeParcela }) {
  const { DateFormat } = UseDates();

  return (
    <div className="py-2 px-2">
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute left-0 w-full h-0.5 bg-gray-100 top-2"></div>

        <div className="flex justify-between w-full">
          <div className="relative flex flex-col items-center">
            <CircleCheck className="w-5 h-5 mb-2 z-10 fill-neutral-400 text-white" />
            <div className="text-center ">
              <h3 className="text-sm font-semibold">Data de Compra</h3>
              <p className="text-xs text-gray-500 mt-1">{DateFormat(DataCompra)}</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <CircleEllipsisIcon className="w-5 h-5 mb-2 z-10 fill-orange-400 text-white" />
            <div className="text-center ">
              <h3 className="text-sm font-semibold">Parcela Atual</h3>
              <p className="text-xs text-gray-500 mt-1">
                {ParcelaAtual} de {QtdeParcela}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <CircleCheck className="w-5 h-5 mb-2 z-10 fill-green-400 text-white" />
            <div className="text-center ">
              <h3 className="text-sm font-semibold">Última Parcela</h3>
              <p className="text-xs text-gray-500 mt-1">{DataFim}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
