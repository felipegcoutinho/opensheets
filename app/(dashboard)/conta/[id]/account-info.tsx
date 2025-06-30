import { PaymentMethodLogo } from "@/components/payment-method-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import BalanceItem from "./balance-item";

function AccountInfo({ item, sumAccountIncome, accountExpense, saldo }) {
  return (
    <Card className="mt-4 w-full p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center">
          <PaymentMethodLogo
            url_name={`/logos/${item.logo_image}`}
            width={60}
            height={60}
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
