import Numbers from "@/components/numbers";
import { UseDates } from "@/hooks/use-dates";
import Image from "next/image";

function RecentesTransactions({ transactions }) {
  function getLogo(item) {
    const contaLogo = item.contas?.logo_image;
    const cartaoLogo = item.cartoes?.logo_image;
    return contaLogo ?? cartaoLogo;
  }

  const { DateFormat } = UseDates();

  return (
    <div className="mb-4">
      {transactions?.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700"
        >
          <div className="flex items-center gap-2">
            <Image
              src={`/logos/${getLogo(item)}`}
              className="rounded-full"
              width={24}
              height={24}
              alt="Logo do cartão"
              quality={100}
            />
            <div className="flex flex-col items-start py-1">
              <p>{item.descricao}</p>
              <p className="text-xs text-muted-foreground">
                {DateFormat(item.data_compra)}
              </p>
            </div>
          </div>

          <p>
            <Numbers value={item.valor} />
          </p>
        </div>
      ))}
    </div>
  );
}

export default RecentesTransactions;
