import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BalanceItem from "./balance-item";

function AccountInfo({ item, sumAccountIncome, accountExpense, saldo }) {
  return (
    <Card className="w-full p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={`/logos/${item.logo_image}`}
            alt={`Logo do cartão ${item.descricao}`}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold">{item.descricao}</span>
            <Badge className="mt-1 rounded-full uppercase" variant="secondary">
              Conta {item.tipo_conta}
            </Badge>
          </div>
        </div>
      </div>

      {/* Dados principais */}
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <Card className="p-4">
          <BalanceItem label="Receitas" value={sumAccountIncome} />
        </Card>

        <Card className="p-4">
          <BalanceItem label="Despesas" value={accountExpense} />
        </Card>

        <Card className="flex flex-col items-start justify-center p-4">
          <BalanceItem label="Saldo" value={saldo} />
        </Card>
      </div>
    </Card>
  );
}

export default AccountInfo;
